<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'role_id',
        'first_best_time_id',
        'second_best_time_id',
        'third_best_time_id',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function role()
    {
        return $this->belongsTo('App\Models\Role');
    }

    public function coursesUsers()
    {
        return $this->hasMany('App\Models\CourseUser');
    }

    public function lectures()
    {
        return $this->hasMany('App\Models\Lecture');
    }

//    public function isAdmin()
//    {
//        if ($this->role->name = 'admin') {
//            return true;
//        } else
//            return false;
//    }
//
//    public function isStudent()
//    {
//        if ($this->role->name = 'student') {
//            return true;
//        } else return false;
//    }
//
//    public function isDoctor()
//    {
//        if ($this->role->name = 'doctor') {
//            return true;
//        } else return false;
//    }
//
//    public function isAssistant()
//    {
//        if ($this->role->name = 'assistant') {
//            return true;
//        } else return false;
//    }


}
