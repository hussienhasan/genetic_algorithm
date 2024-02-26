<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $fillable=[
        'name', 'type', 'capacity', 'datashow'
    ];

    protected $table='classrooms';
    public function scheduledCourses(){
        return $this->hasMany('App\Models\ScheduledLecture');
    }


    use HasFactory;
}
