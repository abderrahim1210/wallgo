<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'post_type',
        'schedule_time',
        'expires_at',
        'unlock_time',
        'capsule_status',
        'is_published',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
