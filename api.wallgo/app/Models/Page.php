<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function pages()
    {
        return $this->morphMany(Page::class, 'postable');
    }
}
