<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['user_id', 'content', 'post_id'];
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }
}
