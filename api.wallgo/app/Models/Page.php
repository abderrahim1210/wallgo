<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Override;

class Page extends Model
{
    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'logo_url',
        'banner_url',
        'category'
    ];

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function followers()
    {
        return $this->morphToMany(User::class, 'followable', 'page_group_follows');
    }

    public function posts()
    {
        return $this->morphMany(Post::class, 'postable');
    }

    // #[Override]
    protected static function booted()
    {
        static::deleting(function ($page) {
            $page->posts()->delete();
            $page->followers()->delete();
            $page->reports()->delete();
        });
    }
}
