<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('showtime_id')
                ->constrained('showtimes')
                ->restrictOnDelete();

            $table->string('booking_code', 30)->unique();

            $table->decimal('total_amount', 8, 2);

            $table->enum('status', [
                'confirmed',
                'cancelled'
            ])->default('confirmed');

            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps();

            $table->index([
                'user_id',
                'created_at'
            ]);

            $table->index([
                'showtime_id',
                'status'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};