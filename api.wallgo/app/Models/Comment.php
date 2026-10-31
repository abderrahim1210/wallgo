<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'content', 'post_id', 'reply_to'];
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

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

    public function replies()
    {
        return $this->hasMany(Comment::class, 'reply_to')->with(['user', 'replies.user'])->withCount('likes');
    }

    public function reel()
    {
        return $this->belongsTo(Reel::class);
    }

    protected static function booted()
    {
        static::deleting(function ($comment) {
            $comment->reports()->delete();
            $comment->likes()->delete();
            foreach ($comment->replies as $r) {
                $r->delete();
            }
        });
    }
}
