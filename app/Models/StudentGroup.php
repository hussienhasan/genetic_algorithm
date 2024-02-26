<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentGroup extends Model
{
    protected $fillable=[
        'year', 'department', 'category','size','division'
    ];

    protected $table = 'students_groups';

    use HasFactory;

    public function lecturesStudentsGroups()
    {
        return $this->hasMany('App\Models\LectureStudentGroup','students_group_id');
    }
}
