<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UtilityLecture extends Model
{
    protected $fillable=[
        'utility_id',
        'lecture_id',
    ];
    protected $table='utilities_lectures';
    use HasFactory;
    public function utility()
    {
        return $this->belongsTo('App\Models\Utilities','utility_id');
    }
    public function lecture()
    {
        return $this->belongsTo('App\Models\Lecture',);
    }
}
