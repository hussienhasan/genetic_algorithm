<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Utilities extends Model
{
    protected $fillable=[
        'name', 'count'
    ];
    protected $table='utilities';
    use HasFactory;
    public function utilitiesLectures(){
        return $this->hasMany('App\Models\UtilityLecture','utility_id');
    }

}
