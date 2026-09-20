<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Seat;
use Illuminate\Http\Request;

class SeatController extends Controller
{
    /**
     * Afficher tous les sièges d'une salle.
     */
    public function index(Room $room)
    {
        $seats = $room->seats()
            ->orderBy('row_label')
            ->orderBy('seat_number')
            ->get();

        return response()->json([
            'room' => $room,
            'seats' => $seats,
        ]);
    }

    /**
     * Générer automatiquement les sièges selon la capacité de la salle.
     */
    public function generate(Room $room)
    {
        $existingSeats = $room->seats()->count();

        if ($existingSeats > 0) {
            return response()->json([
                'message' => 'Cette salle contient déjà des sièges. Supprimez-les avant de générer une nouvelle configuration.',
            ], 422);
        }

        $capacity = $room->capacity;
        $seatsPerRow = 10;
        $numberOfRows = (int) ceil($capacity / $seatsPerRow);

        $createdSeats = [];

        for ($row = 0; $row < $numberOfRows; $row++) {
            /*
             * Génère les rangées comme Excel :
             * A, B, ..., Z, AA, AB, ..., AZ, BA...
             */
            $rowLabel = '';
            $rowNumber = $row + 1;

            while ($rowNumber > 0) {
                $rowNumber--;

                $rowLabel =
                    chr(65 + ($rowNumber % 26))
                    . $rowLabel;

                $rowNumber = intdiv($rowNumber, 26);
            }

            $seatsInThisRow = min(
                $seatsPerRow,
                $capacity - ($row * $seatsPerRow)
            );

            for ($number = 1; $number <= $seatsInThisRow; $number++) {
                $createdSeats[] = [
                    'row_label' => $rowLabel,
                    'seat_number' => $number,
                    'is_active' => true,
                ];
            }
        }

        $room->seats()->createMany($createdSeats);

        return response()->json([
            'message' => $capacity . ' sièges ont été générés avec succès.',
            'seats' => $room->seats()
                ->orderBy('row_label')
                ->orderBy('seat_number')
                ->get(),
        ], 201);
    }

    /**
     * Supprimer tous les sièges d'une salle
     * avant de générer une nouvelle configuration.
     */
    public function clear(Room $room)
    {
        $seats = $room->seats()->get();

        foreach ($seats as $seat) {
            if ($seat->reservationSeats()->exists()) {
                return response()->json([
                    'message' => 'Impossible de supprimer les sièges car au moins un siège possède un historique de réservation.',
                ], 422);
            }
        }

        $deletedCount = $seats->count();

        $room->seats()->delete();

        return response()->json([
            'message' => $deletedCount . ' sièges ont été supprimés avec succès.',
        ]);
    }

    /**
     * Ajouter un siège dans une salle.
     */
    public function store(Request $request, Room $room)
    {
        $validated = $request->validate([
            'row_label' => [
                'required',
                'string',
                'max:10',
                'regex:/^[A-Za-z]+$/',
            ],
            'seat_number' => [
                'required',
                'integer',
                'min:1',
                'max:1000',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $rowLabel = strtoupper($validated['row_label']);
        $seatNumber = $validated['seat_number'];

        if ($room->seats()->count() >= $room->capacity) {
            return response()->json([
                'message' => 'La capacité maximale de cette salle est atteinte.',
            ], 422);
        }

        $seatExists = $room->seats()
            ->where('row_label', $rowLabel)
            ->where('seat_number', $seatNumber)
            ->exists();

        if ($seatExists) {
            return response()->json([
                'message' => 'Ce siège existe déjà dans cette salle.',
            ], 422);
        }

        $seat = $room->seats()->create([
            'row_label' => $rowLabel,
            'seat_number' => $seatNumber,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Siège créé avec succès.',
            'seat' => $seat,
        ], 201);
    }

    /**
     * Modifier un siège.
     */
    public function update(
        Request $request,
        Room $room,
        Seat $seat
    ) {
        if ($seat->room_id !== $room->id) {
            return response()->json([
                'message' => 'Ce siège n’appartient pas à cette salle.',
            ], 404);
        }

        $validated = $request->validate([
            'row_label' => [
                'sometimes',
                'required',
                'string',
                'max:10',
                'regex:/^[A-Za-z]+$/',
            ],
            'seat_number' => [
                'sometimes',
                'required',
                'integer',
                'min:1',
                'max:1000',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $rowLabel = strtoupper(
            $validated['row_label'] ?? $seat->row_label
        );

        $seatNumber =
            $validated['seat_number'] ?? $seat->seat_number;

        $duplicateExists = $room->seats()
            ->where('id', '!=', $seat->id)
            ->where('row_label', $rowLabel)
            ->where('seat_number', $seatNumber)
            ->exists();

        if ($duplicateExists) {
            return response()->json([
                'message' => 'Un autre siège possède déjà cette référence.',
            ], 422);
        }

        $seat->update([
            ...$validated,
            'row_label' => $rowLabel,
            'seat_number' => $seatNumber,
        ]);

        return response()->json([
            'message' => 'Siège modifié avec succès.',
            'seat' => $seat->fresh(),
        ]);
    }

    /**
     * Supprimer un siège.
     */
    public function destroy(Room $room, Seat $seat)
    {
        if ($seat->room_id !== $room->id) {
            return response()->json([
                'message' => 'Ce siège n’appartient pas à cette salle.',
            ], 404);
        }

        if ($seat->reservationSeats()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer ce siège car il possède un historique de réservation.',
            ], 422);
        }

        $seat->delete();

        return response()->json([
            'message' => 'Siège supprimé avec succès.',
        ]);
    }
}
