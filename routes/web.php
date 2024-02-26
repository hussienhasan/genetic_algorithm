<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use  App\Models\Role;
use  App\Models\User;
use  App\Models\CourseUser;
use  App\Models\Course;





/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the  RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('index');
})->name('login');
Route::get('/hello/{key}', function ($id) {
    return $id ;
});
Route::get('/roles', function(){
    
    $role=Role::find(1);
    foreach($role->users as $user){
      echo  $user->name ."<br>";
    }
});
Route::get('/user/{id}/role', function($id){
    $user=User::find($id);
});
Route::get('/xx/{id}', function($id){
    $lsgs=\App\Models\StudentGroup::find($id)->lecturesStudentsGroups;
    foreach ($lsgs as $cu) {
       echo $cu->lecture_id."<br>";
    }

});
Route::get('/yy', function(){
    $st=\App\Models\LectureStudentGroup::find(1);
     echo $st->students_group->year;

});



Route::get('register', function () {
    return view('register'); 
})->name('register');



Route::get('dashboard', function () {
    return view('admin/dashboard'); 
})->name('admin.dashboard');

Route::get('doctors', function () {
    return view('admin/doctors'); 
})->name('admin.doctors');

Route::get('available-times', function () {
    return view('admin/available-times'); 
})->name('admin.available-times');

Route::get('classrooms', function () {
    return view('admin/classrooms'); 
})->name('admin.classrooms');

Route::get('courses', function () {
    return view('admin/courses'); 
})->name('admin.courses');

Route::get('lectures', function () {
    return view('admin/lectures'); 
})->name('admin.lectures');

Route::get('students-groups', function () {
    return view('admin/students-groups'); 
})->name('admin.students-groups');

Route::get('teachers', function () {
    return view('admin/teachers'); 
})->name('admin.teachers');

Route::get('utilities', function () {
    return view('admin/utilities'); 
})->name('admin.utilities');



Route::get('course', function () {
    return view('users/course'); 
})->name('users.course');

Route::get('doctor', function () {
    return view('users/doctor'); 
})->name('users.doctor');

Route::get('bestTimes', function () {
    return view('users/bestTimes'); 
})->name('users.bestTimes');


Route::get('stcourses', function () {
    return view('users/stcourses'); 
})->name('users.stcourses');

Route::get('student', function () {
    return view('users/student'); 
})->name('users.student');

Route::get('tCourse', function () {
    return view('users/tCourse'); 
})->name('users.tCourse');

Route::get('teacher', function () {
    return view('users/teacher'); 
})->name('users.teacher');

Route::get('uploads', function () {
    return view('users/uploads'); 
})->name('users.uploads');