<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminReservationController extends Controller
{
    /**
     * Afficher toutes les réservations.
     */
    public function index(Request $request)
{
    $query = Reservation::with([
        'user:id,name,email',
        'showtime.movie:id,title',
        'showtime.room:id,name',
        'reservationSeats.seat:id,row_label,seat_number',
    ]);

    if ($request->filled('status')) {
        $request->validate([
            'status' => ['in:confirmed,cancelled'],
        ]);

        $query->where('status', $request->status);
    }

    if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('booking_code', 'like', '%' . $search . '%')
                ->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery
                        ->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
        });
    }

    if ($request->filled('showtime_id')) {
        $query->where('showtime_id', $request->showtime_id);
    }

    $reservations = $query
        ->latest()
        ->get();

    return response()->json([
        'reservations' => $reservations,
    ]);
}
    /**
     * Afficher le détail d'une réservation.
     */
    public function show(Reservation $reservation)
    {
         $reservation->load([
        'user:id,name,email',
        'showtime.movie',
        'showtime.room',
        'seats',
    ]);
        return response()->json([
            'reservation' => $reservation,
        ]);
    }

    /**
     * Annuler une réservation depuis l'administration.
     */
    public function cancel(Reservation $reservation)
    {
        DB::transaction(function () use ($reservation) {

            // Verrouillage de la réservation
            $reservation = Reservation::lockForUpdate()
                ->with('showtime')
                ->findOrFail($reservation->id);

            if ($reservation->status === 'cancelled') {
                throw ValidationException::withMessages([
                    'reservation' => [
                        'Cette réservation est déjà annulée.',
                    ],
                ]);
            }

            if ($reservation->showtime->start_time->isPast()) {
                throw ValidationException::withMessages([
                    'reservation' => [
                        'Cette réservation ne peut plus être annulée.',
                    ],
                ]);
            }

            $reservation->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            // Libérer les sièges
            $reservation->reservationSeats()->delete();
        });

        return response()->json([
            'message' => 'Réservation annulée par l’administration.',
        ]);
    }

    /**
     * Rechercher une réservation par son code.
     */
    public function verifyByCode(string $bookingCode)
{
    $reservation = Reservation::with([
        'user:id,name,email',
        'showtime.movie',
        'showtime.room',
        'seats',
    ])
        ->where('booking_code', $bookingCode)
        ->first();

    if (!$reservation) {
        return response()->json([
            'message' => 'Code de réservation introuvable.',
        ], 404);
    }

    return response()->json([
        'reservation' => $reservation,
    ]);
}
}