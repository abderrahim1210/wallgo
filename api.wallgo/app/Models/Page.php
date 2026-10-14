<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    //

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }
}
