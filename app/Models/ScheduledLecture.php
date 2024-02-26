<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduledLecture extends Model
{
    protected $fillable=[
        'time_id', 'classroom_id', 'lecture_id',
    ];

    protected $table='scheduled_lectures';
    public function classroom(){
        return $this->belongsTo('App\Models\Classroom');
    }
    use HasFactory;
    public function lecture(){
        return $this->belongsTo('App\Models\Lecture');
    }
    public function time(){
        return $this->belongsTo('App\Models\Time');
    }
}
