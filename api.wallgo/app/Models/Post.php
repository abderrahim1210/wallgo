<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Post extends Model
{
    use HasFactory;
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
        'postable_type',
        'visibility'
    ];

    protected $appends = ['is_owner'];

    public function getIsOwnerAttribute()
    {
        return $this->user_id === Auth::id();
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

    public function posts()
    {
        return $this->morphMany(Bookmark::class, 'booktable');
    }

    public function bookmarks()
    {
        return $this->morphMany(Bookmark::class, 'booktable');
    }
}
