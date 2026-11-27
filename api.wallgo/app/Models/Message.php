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
        'is_read',
        'edited',
        'reply_to',
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

    public function messageToReply()
    {
        return $this->belongsTo(Message::class, 'reply_to');
    }
}
