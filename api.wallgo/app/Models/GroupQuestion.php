<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupQuestion extends Model
{
    protected $fillable = [
        'group_id',
        'question'
    ];

    protected $table = 'groups_questions';

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
