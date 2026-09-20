<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'showtime_id',
        'booking_code',
        'total_amount',
        'status',
        'cancelled_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'cancelled_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function showtime()
    {
        return $this->belongsTo(Showtime::class);
    }

    public function reservationSeats()
    {
        return $this->hasMany(ReservationSeat::class);
    }

    public function seats()
    {
        return $this->belongsToMany(
            Seat::class,
            'reservation_seats',
            'reservation_id',
            'seat_id'
        )->withPivot([
            'showtime_id',
            'price',
        ]);
    }
}