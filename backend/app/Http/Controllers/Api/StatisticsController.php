<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Reservation;
use App\Models\Showtime;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    /**
     * Statistiques générales du cinéma.
     */
    public function index()
    {
        $confirmedReservations = Reservation::where(
            'status',
            'confirmed'
        );

        $totalRevenue = (clone $confirmedReservations)->sum('total_amount');

        $totalTickets = DB::table('reservation_seats')
            ->join(
                'reservations',
                'reservations.id',
                '=',
                'reservation_seats.reservation_id'
            )
            ->where('reservations.status', 'confirmed')
            ->count();

        $popularMovies = Movie::query()
            ->select([
                'movies.id',
                'movies.title',
                DB::raw('COUNT(reservation_seats.id) as tickets_sold'),
            ])
            ->join('showtimes', 'showtimes.movie_id', '=', 'movies.id')
            ->join(
                'reservation_seats',
                'reservation_seats.showtime_id',
                '=',
                'showtimes.id'
            )
            ->join(
                'reservations',
                'reservations.id',
                '=',
                'reservation_seats.reservation_id'
            )
            ->where('reservations.status', 'confirmed')
            ->groupBy('movies.id', 'movies.title')
            ->orderByDesc('tickets_sold')
            ->limit(5)
            ->get();

        return response()->json([
            'statistics' => [
                'total_movies' => Movie::count(),
                'active_movies' => Movie::where('is_active', true)->count(),
                'total_showtimes' => Showtime::count(),
                'active_showtimes' => Showtime::where('is_active', true)->count(),
                'total_clients' => User::where('role', 'client')->count(),
                'total_reservations' => Reservation::count(),
                'confirmed_reservations' => Reservation::where(
                    'status',
                    'confirmed'
                )->count(),
                'cancelled_reservations' => Reservation::where(
                    'status',
                    'cancelled'
                )->count(),
                'total_tickets_sold' => $totalTickets,
                'total_revenue' => number_format($totalRevenue, 2, '.', ''),
                'popular_movies' => $popularMovies,
            ],
        ]);
    }
}