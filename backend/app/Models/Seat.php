<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'row_label',
        'seat_number',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'seat_number' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function reservationSeats()
    {
        return $this->hasMany(ReservationSeat::class);
    }
}