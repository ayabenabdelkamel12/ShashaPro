<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservation_seats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('reservation_id')
                ->constrained('reservations')
                ->cascadeOnDelete();

            $table->foreignId('showtime_id')
                ->constrained('showtimes')
                ->restrictOnDelete();

            $table->foreignId('seat_id')
                ->constrained('seats')
                ->restrictOnDelete();

            $table->decimal('price', 8, 2);

            $table->timestamps();

            $table->unique([
                'showtime_id',
                'seat_id'
            ]);

            $table->index([
                'reservation_id',
                'seat_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_seats');
    }
};