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
        'media_url',
        'postable_id',
        'postable_type'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'liketable');
    }


    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function postable()
    {
        return $this->morphTo();
    }
}
