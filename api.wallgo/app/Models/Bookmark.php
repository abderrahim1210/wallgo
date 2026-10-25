<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    protected $fillable = [
        'user_id',
        'booktable_id',
        'booktable_type'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booktable()
    {
        return $this->morphTo();
    }
}
