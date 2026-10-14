<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'user_id',
        'reason',
        'description',
        'reportable_type',
        'reportable_id',
        'status'
    ];

    public function reportable()
    {
        return $this->morphTo();
    }
}
