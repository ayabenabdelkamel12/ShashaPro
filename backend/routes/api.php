<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\SeatController;
use App\Http\Controllers\Api\ShowtimeController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AdminReservationController;
use App\Http\Controllers\Api\StatisticsController;


/*
|--------------------------------------------------------------------------
| AUTHENTIFICATION
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    // Routes publiques
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Routes protégées
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});


/*
|--------------------------------------------------------------------------
| MOVIES - PUBLIC
|--------------------------------------------------------------------------
*/

Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{movie}', [MovieController::class, 'show']);


/*
|--------------------------------------------------------------------------
| SHOWTIMES - PUBLIC
|--------------------------------------------------------------------------
*/

Route::get('/showtimes', [ShowtimeController::class, 'index']);
Route::get('/showtimes/{showtime}', [ShowtimeController::class, 'show']);


/*
|--------------------------------------------------------------------------
| RESERVATIONS - CLIENT CONNECTÉ
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Sièges disponibles pour une séance
    Route::get(
        '/showtimes/{showtime}/available-seats',
        [ReservationController::class, 'availableSeats']
    );

    // Créer une réservation
    Route::post(
        '/reservations',
        [ReservationController::class, 'store']
    );

    // Historique du client
    Route::get(
        '/my-reservations',
        [ReservationController::class, 'myReservations']
    );

    // Détails d'une réservation
    Route::get(
        '/reservations/{reservation}',
        [ReservationController::class, 'show']
    );

    // Annuler une réservation
    Route::patch(
        '/reservations/{reservation}/cancel',
        [ReservationController::class, 'cancel']
    );
});


/*
|--------------------------------------------------------------------------
| ROUTES ADMINISTRATEUR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->group(function () {

        /*
        | Test du rôle Admin
        */

        Route::get('/test', function () {
            return response()->json([
                'message' => 'Bienvenue dans la zone Admin de ShashaPro.'
            ]);
        });


        /*
        | MOVIES
        */

        Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{movie}', [MovieController::class, 'show']);

Route::post('/movies', [MovieController::class, 'store']);
Route::put('/movies/{movie}', [MovieController::class, 'update']);
Route::delete('/movies/{movie}', [MovieController::class, 'destroy']);

        /*
        | ROOMS
        */

        Route::apiResource('rooms', RoomController::class);


        /*
        | SEATS
        */
Route::get('/rooms/{room}/seats', [SeatController::class, 'index']);

Route::delete('/rooms/{room}/seats/clear', [SeatController::class, 'clear']);

Route::post('/rooms/{room}/seats/generate', [SeatController::class, 'generate']);

Route::post('/rooms/{room}/seats', [SeatController::class, 'store']);

Route::put('/rooms/{room}/seats/{seat}', [SeatController::class, 'update']);

Route::delete('/rooms/{room}/seats/{seat}', [SeatController::class, 'destroy']);

        /*
        | SHOWTIMES
        */

        /*
| SHOWTIMES
*/

Route::get('/showtimes', [ShowtimeController::class, 'index']);
Route::get('/showtimes/{showtime}', [ShowtimeController::class, 'show']);

Route::post('/showtimes', [ShowtimeController::class, 'store']);
Route::put('/showtimes/{showtime}', [ShowtimeController::class, 'update']);
Route::delete('/showtimes/{showtime}', [ShowtimeController::class, 'destroy']);

        /*
        | RESERVATIONS
        */

        // Vérification par code : avant /{reservation}
        Route::get(
            '/reservations/verify/{bookingCode}',
            [AdminReservationController::class, 'verifyByCode']
        );

        // Liste de toutes les réservations
        Route::get(
            '/reservations',
            [AdminReservationController::class, 'index']
        );

        // Détails d'une réservation
        Route::get(
            '/reservations/{reservation}',
            [AdminReservationController::class, 'show']
        );

        // Annulation d'une réservation
        Route::patch(
            '/reservations/{reservation}/cancel',
            [AdminReservationController::class, 'cancel']
        );


        /*
        | STATISTIQUES
        */

        Route::get(
            '/statistics',
            [StatisticsController::class, 'index']
        );
    });