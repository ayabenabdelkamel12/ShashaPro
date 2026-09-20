<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MovieController extends Controller
{
    /**
     * Liste des films actifs
     */
    public function index(Request $request)
    {
        $query = Movie::query()
            ->where('is_active', true);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($query) use ($search) {
                $query->where('title', 'like', '%' . $search . '%')
                    ->orWhere('genre', 'like', '%' . $search . '%')
                    ->orWhere('director', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('genre')) {
            $query->where('genre', $request->genre);
        }

        $movies = $query
            ->latest()
            ->get();

        return response()->json([
            'movies' => $movies,
        ]);
    }

    /**
     * Afficher un film
     */
    public function show(Movie $movie)
    {
        if (!$movie->is_active) {
            return response()->json([
                'message' => 'Film indisponible.'
            ], 404);
        }

        return response()->json([
            'movie' => $movie,
        ]);
    }

    /**
     * Création d'un film - Admin
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'genre' => ['nullable', 'string', 'max:100'],
            'duration' => ['required', 'integer', 'min:1'],
            'director' => ['nullable', 'string', 'max:255'],
            'poster' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'release_date' => ['nullable', 'date'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('poster')) {
            $validated['poster_url'] = $request->file('poster')->store('movies', 'public');
        }

        unset($validated['poster']);

        $movie = Movie::create($validated);

        return response()->json([
            'message' => 'Film créé avec succès.',
            'movie' => $movie,
        ], 201);
    }

    /**
     * Modification d'un film - Admin
     */
    public function update(Request $request, Movie $movie)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'genre' => ['nullable', 'string', 'max:100'],
            'duration' => ['sometimes', 'required', 'integer', 'min:1'],
            'director' => ['nullable', 'string', 'max:255'],
            'poster' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'release_date' => ['nullable', 'date'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('poster')) {
            if ($movie->poster_url) {
                Storage::disk('public')->delete($movie->poster_url);
            }

            $validated['poster_url'] = $request->file('poster')->store('movies', 'public');
        }

        unset($validated['poster']);

        $movie->update($validated);

        return response()->json([
            'message' => 'Film modifié avec succès.',
            'movie' => $movie->fresh(),
        ]);
    }

    /**
     * Suppression logique - Admin
     */
    public function destroy(Movie $movie)
    {
        if ($movie->poster_url) {
            Storage::disk('public')->delete($movie->poster_url);
        }

        $movie->delete();

        return response()->json([
            'message' => 'Film supprimé avec succès.',
        ]);
    }
}