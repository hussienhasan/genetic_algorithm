<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Time extends Model
{
    protected $fillable=[
        'day', 'start_time','end_time',
    ];

    protected $table='times';

    use HasFactory;
    public function scheduledlecture(){
        return $this->hasOne('App\Models\ScheduledLecture');
    }
}
