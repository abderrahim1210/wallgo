<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupPageFollow extends Model
{
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
}
