<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecture extends Model
{
    protected $fillable=[
        'user_id', 'course_id', 'lecture_type'
    ];
    protected $table='lectures';
    public function user(){
        return $this->belongsTo('App\Models\User');
    }
    public function course(){
        return $this->belongsTo('App\Models\Course');
    }
    public function utilitiesLectures(){
        return $this->hasMany('App\Models\UtilityLecture',);
    }
    public function scheduledlectures(){
        return $this->hasOne('App\Models\ScheduledLecture');
    }
    public function lecturesStudentsGroups(){
        return $this->hasMany('App\Models\LectureStudentGroup',);
    }

    use HasFactory;
}
