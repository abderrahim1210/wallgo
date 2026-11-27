<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachement extends Model
{
    protected $table = 'message_attachments';

    protected $fillable = [
        'message_id',
        'media_url',
        'public_id',
        'position',
        'duration',
        'type'
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
