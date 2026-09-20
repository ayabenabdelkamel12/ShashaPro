<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Movie extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'genre',
        'duration',
        'director',
        'poster_url',
        'release_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'release_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function showtimes()
    {
        return $this->hasMany(Showtime::class);
    }
}
