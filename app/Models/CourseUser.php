<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseUser extends Model

{
    protected $fillable=[
      'course_id',
        'user_id',
    ];
    protected $table='courses_users';


    public function user(){
        return $this->belongsTo('App\Models\User');
    }
    public function course(){
        return $this->belongsTo('App\Models\Course');
    }

    use HasFactory;
}
