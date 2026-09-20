<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservationSeat extends Model
{
    use HasFactory;

    protected $table = 'reservation_seats';

    public $timestamps = false;

    protected $fillable = [
        'reservation_id',
        'showtime_id',
        'seat_id',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function reservation()
    {
        return $this->belongsTo(
            Reservation::class
        );
    }

    public function showtime()
    {
        return $this->belongsTo(
            Showtime::class
        );
    }

    public function seat()
    {
        return $this->belongsTo(
            Seat::class
        );
    }
}

