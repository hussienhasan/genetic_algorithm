<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LectureStudentGroup extends Model
{
    protected $fillable=[
        'lecture_id', 'students_group_id',
    ];

    protected $table='lectures_students_groups';

    use HasFactory;
    protected function lecture(){
        return $this->belongsTo('App\Models\Lecture');
    }
    protected function students_group(){
        return $this->belongsTo('App\Models\StudentGroup');
    }
}
