<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reel extends Model
{
    protected $fillable = [
        'user_id',
        'video_url',
        'caption',
        'audio_name',
        'audio_url',
        'likes_count',
        'comments_count'
    ];

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

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
        return $this->hasMany(Comment::class, 'post_id');
    }
}
