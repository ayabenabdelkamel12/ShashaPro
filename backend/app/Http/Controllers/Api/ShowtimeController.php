<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Showtime;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class ShowtimeController extends Controller
{
    /**
     * Liste publique des séances actives à venir.
     */
    public function index(Request $request)
    {
        $query = Showtime::with(['movie', 'room'])
            ->where('is_active', true)
            ->where('start_time', '>=', now());

        if ($request->filled('movie_id')) {
            $query->where('movie_id', $request->movie_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('start_time', $request->date);
        }

        $showtimes = $query
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'showtimes' => $showtimes,
        ]);
    }

    /**
     * Afficher une séance.
     */
    public function show(Showtime $showtime)
    {
        if (!$showtime->is_active || $showtime->start_time < now()) {
            return response()->json([
                'message' => 'Cette séance n’est plus disponible.',
            ], 404);
        }

        $showtime->load(['movie', 'room']);

        return response()->json([
            'showtime' => $showtime,
        ]);
    }

    /**
     * Créer une séance - Admin.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => [
                'required',
                'exists:movies,id',
            ],
            'room_id' => [
                'required',
                'exists:rooms,id',
            ],
            'start_time' => [
                'required',
                'date',
            ],
            'end_time' => [
                'required',
                'date',
                'after:start_time',
            ],
            'price' => [
                'required',
                'numeric',
                'min:0',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $movie = \App\Models\Movie::findOrFail($validated['movie_id']);
        $room = \App\Models\Room::findOrFail($validated['room_id']);

        if (!$movie->is_active) {
            return response()->json([
                'message' => 'Impossible de créer une séance pour un film inactif.',
            ], 422);
        }

        if (!$room->is_active) {
            return response()->json([
                'message' => 'Impossible de créer une séance dans une salle inactive.',
            ], 422);
        }

        $startTime = Carbon::parse($validated['start_time']);
        $endTime = Carbon::parse($validated['end_time']);

        if ($startTime->isPast()) {
            return response()->json([
                'message' => 'La séance doit être programmée dans le futur.',
            ], 422);
        }

        $this->ensureNoRoomOverlap(
            $validated['room_id'],
            $startTime,
            $endTime
        );

        $showtime = Showtime::create([
            'movie_id' => $validated['movie_id'],
            'room_id' => $validated['room_id'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'price' => $validated['price'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $showtime->load(['movie', 'room']);

        return response()->json([
            'message' => 'Séance créée avec succès.',
            'showtime' => $showtime,
        ], 201);
    }

    /**
     * Modifier une séance - Admin.
     */
    public function update(Request $request, Showtime $showtime)
    {
        $validated = $request->validate([
            'movie_id' => [
                'sometimes',
                'required',
                'exists:movies,id',
            ],
            'room_id' => [
                'sometimes',
                'required',
                'exists:rooms,id',
            ],
            'start_time' => [
                'sometimes',
                'required',
                'date',
            ],
            'end_time' => [
                'sometimes',
                'required',
                'date',
            ],
            'price' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $movieId = $validated['movie_id'] ?? $showtime->movie_id;
        $roomId = $validated['room_id'] ?? $showtime->room_id;

        $startTime = isset($validated['start_time'])
            ? Carbon::parse($validated['start_time'])
            : Carbon::parse($showtime->start_time);

        $endTime = isset($validated['end_time'])
            ? Carbon::parse($validated['end_time'])
            : Carbon::parse($showtime->end_time);

        if ($endTime->lessThanOrEqualTo($startTime)) {
            throw ValidationException::withMessages([
                'end_time' => [
                    'La fin doit être après le début.',
                ],
            ]);
        }

        $movie = \App\Models\Movie::findOrFail($movieId);
        $room = \App\Models\Room::findOrFail($roomId);

        if (!$movie->is_active) {
            return response()->json([
                'message' => 'Impossible d’utiliser un film inactif.',
            ], 422);
        }

        if (!$room->is_active) {
            return response()->json([
                'message' => 'Impossible d’utiliser une salle inactive.',
            ], 422);
        }
if (
    $startTime->isPast() &&
    $startTime->format('Y-m-d H:i:s') !== Carbon::parse($showtime->start_time)->format('Y-m-d H:i:s')
) {
    return response()->json([
        'message' => 'La séance modifiée doit être programmée dans le futur.',
    ], 422);
}

        $this->ensureNoRoomOverlap(
            $roomId,
            $startTime,
            $endTime,
            $showtime->id
        );

        $showtime->update([
            'movie_id' => $movieId,
            'room_id' => $roomId,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'price' => $validated['price'] ?? $showtime->price,
            'is_active' => $validated['is_active'] ?? $showtime->is_active,
        ]);

        $showtime->load(['movie', 'room']);

        return response()->json([
            'message' => 'Séance modifiée avec succès.',
            'showtime' => $showtime,
        ]);
    }

    /**
     * Désactiver / supprimer une séance.
     */
    public function destroy(Showtime $showtime)
    {
        if ($showtime->reservations()->exists()) {
            $showtime->update([
                'is_active' => false,
            ]);

            return response()->json([
                'message' => 'La séance possède des réservations. Elle a été désactivée au lieu d’être supprimée.',
                'showtime' => $showtime->fresh(),
            ]);
        }

        $showtime->delete();

        return response()->json([
            'message' => 'Séance supprimée avec succès.',
        ]);
    }

    /**
     * Vérifie qu'une salle n'a pas deux séances qui se chevauchent.
     */
    private function ensureNoRoomOverlap(
        int $roomId,
        $startTime,
        $endTime,
        ?int $exceptShowtimeId = null
    ): void {
        $query = Showtime::where('room_id', $roomId)
            ->where(function ($query) use ($startTime, $endTime) {
                $query
                    ->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $startTime);
            });

        if ($exceptShowtimeId !== null) {
            $query->where('id', '!=', $exceptShowtimeId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'start_time' => [
                    'Cette salle possède déjà une séance pendant cette période.',
                ],
            ]);
        }
    }
}