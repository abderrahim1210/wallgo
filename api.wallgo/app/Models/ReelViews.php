<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReelViews extends Model
{
    protected $table = 'reel_views';
    protected $fillable = [
        'user_id',
        'reel_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reel()
    {
        return $this->belongsTo(Reel::class);
    }
}
