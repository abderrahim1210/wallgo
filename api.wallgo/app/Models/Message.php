<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'media_url',
        'is_read',
        'public_id',
        'edited'
    ];

    protected $casts = [
        'is_read' => 'boolean'
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function medias()
    {
        return $this->hasMany(MessageAttachement::class);
    }
}
