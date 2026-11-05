<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class GroupPageFollow extends Model
{
    use Notifiable;
    protected $table = 'page_group_follows';

    protected $fillable = [
        'user_id',
        'followable_id',
        'followable_type'
    ];

    public function followable()
    {
        return $this->morphTo();
    }

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }
}
