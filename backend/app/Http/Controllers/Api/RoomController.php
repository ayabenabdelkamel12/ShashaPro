<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    /**
     * Liste de toutes les salles avec le nombre de sièges.
     */
    public function index()
    {
        $rooms = Room::withCount('seats')
            ->orderBy('name')
            ->get();

        return response()->json([
            'rooms' => $rooms
        ]);
    }

    /**
     * Afficher une salle avec ses sièges.
     */
    public function show(Room $room)
    {
        $room->load([
            'seats' => function ($query) {
                $query->orderBy('row_label')
                    ->orderBy('seat_number');
            }
        ]);

        return response()->json([
            'room' => $room
        ]);
    }

    /**
     * Créer une nouvelle salle.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:rooms,name'
            ],
            'capacity' => [
                'required',
                'integer',
                'min:1',
                'max:1000'
            ],
            'is_active' => [
                'sometimes',
                'boolean'
            ],
        ]);

        $room = Room::create([
            'name' => $validated['name'],
            'capacity' => $validated['capacity'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Salle créée avec succès.',
            'room' => $room
        ], 201);
    }

    /**
     * Modifier une salle.
     */
    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('rooms', 'name')->ignore($room->id)
            ],
            'capacity' => [
                'sometimes',
                'required',
                'integer',
                'min:1',
                'max:1000'
            ],
            'is_active' => [
                'sometimes',
                'boolean'
            ],
        ]);

        if (
            isset($validated['capacity']) &&
            $validated['capacity'] < $room->seats()->count()
        ) {
            return response()->json([
                'message' => 'La capacité ne peut pas être inférieure au nombre de sièges existants.'
            ], 422);
        }

        $room->update($validated);

        return response()->json([
            'message' => 'Salle modifiée avec succès.',
            'room' => $room->fresh()
        ]);
    }

    /**
     * Supprimer une salle.
     */
    public function destroy(Room $room)
    {
        if ($room->showtimes()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer cette salle car elle possède des séances.'
            ], 422);
        }

        $hasReservationHistory = $room->seats()
            ->whereHas('reservationSeats')
            ->exists();

        if ($hasReservationHistory) {
            return response()->json([
                'message' => 'Impossible de supprimer cette salle car certains sièges possèdent un historique de réservation.'
            ], 422);
        }

        DB::transaction(function () use ($room) {
            $room->seats()->delete();
            $room->delete();
        });

        return response()->json([
            'message' => 'Salle supprimée avec succès.'
        ]);
    }
}