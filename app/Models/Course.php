<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table='courses';
    protected $fillable=[
        'name',
        'year'

    ];

    use HasFactory;
    public function coursesUsers(){
        return $this->hasMany('App\Models\CourseUser');
    }

    public function lectures(){
        return $this->hasMany('App\Models\Lecture');
    }
    public function uploads(){
        return $this->hasMany('App\Models\Upload');
    }

}
