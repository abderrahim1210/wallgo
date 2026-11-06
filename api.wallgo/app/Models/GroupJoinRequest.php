<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupJoinRequest extends Model
{
    protected $table = 'groups_join_requests';

    protected $fillable = [
        'group_id',
        'user_id',
        'answer',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
