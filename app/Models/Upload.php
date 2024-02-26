<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Upload extends Model
{
    protected $fillable=[
        'name','path', 'type','course_id'

    ];
    protected $table='uploads';
    use HasFactory;
    public function course(){
        return $this->belongsTo('App\Models\Course');
    }
}
