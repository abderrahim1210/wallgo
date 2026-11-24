<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('deleted_at')->withTimestamps();
    }

    public function latestMessage()
    {
        return $this->hasOne(Message::class)->withCount(['medias'])->latest();
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }
}
