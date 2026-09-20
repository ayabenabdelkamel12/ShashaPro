<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\ReservationSeat;
use App\Models\Seat;
use App\Models\Showtime;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    /**
     * Afficher les sièges disponibles pour une séance.
     */
    public function availableSeats(Showtime $showtime)
    {
        $showtime->load(['movie', 'room']);

        if (!$showtime->is_active) {
            return response()->json([
                'message' => 'Cette séance est inactive.',
            ], 404);
        }

        if ($showtime->start_time->isPast()) {
            return response()->json([
                'message' => 'Cette séance est déjà commencée.',
            ], 404);
        }

        if (!$showtime->movie || !$showtime->movie->is_active) {
            return response()->json([
                'message' => 'Le film associé à cette séance n’est plus disponible.',
            ], 404);
        }

        if (!$showtime->room || !$showtime->room->is_active) {
            return response()->json([
                'message' => 'La salle associée à cette séance n’est plus disponible.',
            ], 404);
        }

        $reservedSeatIds = ReservationSeat::where(
            'showtime_id',
            $showtime->id
        )->pluck('seat_id');

        $seats = Seat::where('room_id', $showtime->room_id)
            ->where('is_active', true)
            ->orderBy('row_label')
            ->orderBy('seat_number')
            ->get()
            ->map(function ($seat) use ($reservedSeatIds) {
                return [
                    'id' => $seat->id,
                    'row_label' => $seat->row_label,
                    'seat_number' => $seat->seat_number,
                    'is_available' => !$reservedSeatIds->contains($seat->id),
                ];
            });

        return response()->json([
            'showtime' => $showtime,
            'seats' => $seats,
        ]);
    }

    /**
     * Créer une réservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'showtime_id' => [
                'required',
                'integer',
                'exists:showtimes,id',
            ],
            'seat_ids' => [
                'required',
                'array',
                'min:1',
            ],
            'seat_ids.*' => [
                'required',
                'integer',
                'distinct',
                'exists:seats,id',
            ],
        ]);

        try {
            $reservation = DB::transaction(function () use ($validated, $request) {

                /*
                 * On verrouille la séance pendant la réservation
                 * afin d'éviter les conflits simultanés.
                 */
                $showtime = Showtime::with(['movie', 'room'])
                    ->lockForUpdate()
                    ->findOrFail($validated['showtime_id']);

                if (!$showtime->is_active) {
                    throw ValidationException::withMessages([
                        'showtime_id' => [
                            'Cette séance est inactive.',
                        ],
                    ]);
                }

                if ($showtime->start_time->isPast()) {
                    throw ValidationException::withMessages([
                        'showtime_id' => [
                            'Cette séance est déjà commencée.',
                        ],
                    ]);
                }

                if (!$showtime->movie || !$showtime->movie->is_active) {
                    throw ValidationException::withMessages([
                        'showtime_id' => [
                            'Le film associé à cette séance n’est plus disponible.',
                        ],
                    ]);
                }

                if (!$showtime->room || !$showtime->room->is_active) {
                    throw ValidationException::withMessages([
                        'showtime_id' => [
                            'La salle associée à cette séance n’est plus disponible.',
                        ],
                    ]);
                }

                $seatIds = $validated['seat_ids'];

                /*
                 * Récupération et verrouillage des sièges.
                 */
                $seats = Seat::whereIn('id', $seatIds)
                    ->where('room_id', $showtime->room_id)
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->get();

                if ($seats->count() !== count($seatIds)) {
                    throw ValidationException::withMessages([
                        'seat_ids' => [
                            'Un ou plusieurs sièges sont invalides, inactifs ou n’appartiennent pas à cette salle.',
                        ],
                    ]);
                }

                /*
                 * Vérifier si un des sièges est déjà réservé
                 * pour cette séance.
                 */
                $alreadyReserved = ReservationSeat::where(
                    'showtime_id',
                    $showtime->id
                )
                    ->whereIn('seat_id', $seatIds)
                    ->exists();

                if ($alreadyReserved) {
                    throw ValidationException::withMessages([
                        'seat_ids' => [
                            'Un ou plusieurs sièges sont déjà réservés.',
                        ],
                    ]);
                }

                $bookingCode = $this->generateBookingCode();

                $totalAmount = $showtime->price * count($seatIds);

                $reservation = Reservation::create([
                    'user_id' => $request->user()->id,
                    'showtime_id' => $showtime->id,
                    'booking_code' => $bookingCode,
                    'total_amount' => $totalAmount,
                    'status' => 'confirmed',
                ]);

                foreach ($seats as $seat) {
                    ReservationSeat::create([
                        'reservation_id' => $reservation->id,
                        'showtime_id' => $showtime->id,
                        'seat_id' => $seat->id,
                        'price' => $showtime->price,
                    ]);
                }

                return $reservation->load([
                    'showtime.movie',
                    'showtime.room',
                    'reservationSeats.seat',
                ]);
            });

            return response()->json([
                'message' => 'Réservation confirmée avec succès.',
                'reservation' => $reservation,
            ], 201);

        } catch (QueryException $exception) {

            /*
             * Protection supplémentaire contre une double réservation
             * grâce à la contrainte UNIQUE(showtime_id, seat_id).
             */
            if ($exception->getCode() === '23000') {
                return response()->json([
                    'message' => 'Un ou plusieurs sièges viennent d’être réservés par un autre utilisateur.',
                ], 409);
            }

            throw $exception;
        }
    }

    /**
     * Historique des réservations du client connecté.
     */
    public function myReservations(Request $request)
    {
        $reservations = Reservation::with([
            'showtime.movie',
            'showtime.room',
            'reservationSeats.seat',
        ])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'reservations' => $reservations,
        ]);
    }

    /**
     * Afficher une réservation appartenant au client connecté.
     */
    public function show(Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Accès refusé.',
            ], 403);
        }

        $reservation->load([
    'showtime.movie',
    'showtime.room',
    'seats',
]);

        return response()->json([
            'reservation' => $reservation,
        ]);
    }

    /**
     * Annuler une réservation et libérer les sièges.
     */
    public function cancel(Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Accès refusé.',
            ], 403);
        }

        if ($reservation->status === 'cancelled') {
            return response()->json([
                'message' => 'Cette réservation est déjà annulée.',
            ], 422);
        }

        $reservation->load('showtime');

        if ($reservation->showtime->start_time->isPast()) {
            return response()->json([
                'message' => 'Cette réservation ne peut plus être annulée.',
            ], 422);
        }

        DB::transaction(function () use ($reservation) {

            /*
             * On recharge et verrouille la réservation
             * pour éviter deux annulations simultanées.
             */
            $lockedReservation = Reservation::lockForUpdate()
                ->findOrFail($reservation->id);

            if ($lockedReservation->status === 'cancelled') {
                throw ValidationException::withMessages([
                    'reservation' => [
                        'Cette réservation est déjà annulée.',
                    ],
                ]);
            }

            $lockedReservation->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            /*
             * Les sièges sont libérés.
             * La réservation reste conservée dans l'historique.
             */
            $lockedReservation->reservationSeats()->delete();
        });

        return response()->json([
            'message' => 'Réservation annulée. Les sièges sont de nouveau disponibles.',
        ]);
    }

    /**
     * Générer un code de réservation unique.
     */
    private function generateBookingCode(): string
    {
        do {
            $code = 'SHA-' . strtoupper(Str::random(10));
        } while (
            Reservation::where('booking_code', $code)->exists()
        );

        return $code;
    }
}