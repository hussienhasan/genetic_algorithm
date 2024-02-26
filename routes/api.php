<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


// user route //
Route::post('/register', [\App\Http\Controllers\ApiReg\RegisterController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\ApiReg\RegisterController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\ApiReg\RegisterController::class, 'logout']);



// all users
Route::get('/users', [\App\Http\Controllers\UsersController::class, 'index']);
Route::get('/courses', [\App\Http\Controllers\CoursesController::class, 'index']);
Route::get('/classrooms', [\App\Http\Controllers\ClassroomsController::class, 'index']);
Route::get('/normal_lectures', [\App\Http\Controllers\LecturesController::class, 'normalLectures']);
Route::get('/students_groups', [\App\Http\Controllers\StudentGroupsController::class, 'index']);
Route::get('/lectures_students_groups', [\App\Http\Controllers\LecturesStudentsGroupsController::class, 'index']);
Route::get('/times', [\App\Http\Controllers\TimesController::class, 'index']);
Route::get('/utilities', [\App\Http\Controllers\UtilitiesController::class, 'index']);
Route::get('/utilities_lectures', [\App\Http\Controllers\UtilitiesLecturesController::class, 'index']);
Route::get('/scheduled_lectures', [\App\Http\Controllers\ScheduledLecturesController::class, 'index']);
Route::get('/best_times/{id}', [\App\Http\Controllers\UsersController::class, 'bestTimes']);
Route::put('/edit_best_time/{id}', [\App\Http\Controllers\UsersController::class, 'editBestTime']);


//admin routes
Route::middleware(['auth:api', 'auth.role:admin,'])->prefix('admin')->group(function () {

    Route::apiResource('/roles', \App\Http\Controllers\RolesController::class);
    Route::apiResource('/users', \App\Http\Controllers\UsersController::class);
    Route::apiResource('/courses_users', \App\Http\Controllers\CourseUserController::class);
    Route::apiResource('/courses', \App\Http\Controllers\CoursesController::class);
    Route::apiResource('/uploads', \App\Http\Controllers\UploadsController::class);
    Route::apiResource('/utilities', \App\Http\Controllers\UtilitiesController::class);
    Route::apiResource('/utilities_lectures', \App\Http\Controllers\UtilitiesLecturesController::class);
    Route::apiResource('/classrooms', \App\Http\Controllers\ClassroomsController::class);
    Route::apiResource('/scheduled_lectures', \App\Http\Controllers\ScheduledLecturesController::class);
    Route::apiResource('/lectures', \App\Http\Controllers\LecturesController::class);
    Route::apiResource('/students_groups', \App\Http\Controllers\StudentGroupsController::class);
    Route::apiResource('/lectures_students_groups', \App\Http\Controllers\LecturesStudentsGroupsController::class);
    Route::apiResource('/times', \App\Http\Controllers\TimesController::class);
    Route::get('/doctors', [\App\Http\Controllers\UsersController::class, 'doctors']);
    Route::get('/assistants', [\App\Http\Controllers\UsersController::class, 'assistants']);
    Route::post('/add_doctor', [\App\Http\Controllers\UsersController::class, 'addDoctor']);
    Route::post('/add_assistant', [\App\Http\Controllers\UsersController::class, 'addAssistant']);
    Route::get('/normal_lectures', [\App\Http\Controllers\LecturesController::class, 'normalLectures']);
    Route::delete('/delete_scheduled_lectures', [\App\Http\Controllers\ScheduledLecturesController::class, 'destroy']);
    
});


// student routes
Route::middleware(['auth:api', 'auth.role:student'])->prefix('student')->group(function () {
    Route::get('/courses', [\App\Http\Controllers\CoursesController::class, 'index']);
    Route::get('/uploadsAsLecture/{id}', [\App\Http\Controllers\UploadsController::class, 'uploadsAsLecture']);
    Route::get('/uploadsAsSession/{id}', [\App\Http\Controllers\UploadsController::class, 'uploadsAsSession']);

});


// doctor routes
Route::middleware(['auth:api', 'auth.role:doctor'])->prefix('doctor')->group(function () {
    Route::get('/myc', [\App\Http\Controllers\CoursesController::class, 'viewMyCourses']);
    Route::get('/uploadsAsLecture/{id}', [\App\Http\Controllers\UploadsController::class, 'uploadsAsLecture']);
    Route::put('/setTimeDoctor/{id}', [\App\Http\Controllers\UsersController::class, 'setTimeDoctor']);

    Route::post('/add_upload', [\App\Http\Controllers\UploadsController::class, 'store']);
    Route::post('/update_upload/{id}', [\App\Http\Controllers\UploadsController::class, 'update']);
    Route::delete('/delete_upload/{id}', [\App\Http\Controllers\UploadsController::class, 'destroy']);

    Route::get('/users', [\App\Http\Controllers\UsersController::class, 'index']);
    Route::get('/courses', [\App\Http\Controllers\CoursesController::class, 'index']);
    Route::get('/classrooms', [\App\Http\Controllers\ClassroomsController::class, 'index']);
    Route::get('/normal_lectures', [\App\Http\Controllers\LecturesController::class, 'normalLectures']);
    Route::get('/students_groups', [\App\Http\Controllers\StudentGroupsController::class, 'index']);
    Route::get('/lectures_students_groups', [\App\Http\Controllers\LecturesStudentsGroupsController::class, 'index']);
    Route::get('/times', [\App\Http\Controllers\TimesController::class, 'index']);
    Route::get('/utilities', [\App\Http\Controllers\UtilitiesController::class, 'index']);
    Route::get('/utilities_lectures', [\App\Http\Controllers\UtilitiesLecturesController::class, 'index']);
    Route::get('/scheduled_lectures', [\App\Http\Controllers\ScheduledLecturesController::class, 'index']);
    Route::get('/best_times/{id}', [\App\Http\Controllers\UsersController::class, 'bestTimes']);
    Route::put('/edit_best_time/{id}', [\App\Http\Controllers\UsersController::class, 'editBestTime']);

 

    

});



// assistant routes
Route::middleware(['auth:api', 'auth.role:assistant,'])->prefix('assistant')->group(function () {
    Route::get('/myc', [\App\Http\Controllers\CoursesController::class, 'viewMyCourses']);
    Route::get('/uploadsAsSession/{id}', [\App\Http\Controllers\UploadsController::class, 'uploadsAsSession']);
    Route::put('/setTimeAssistant/{id}', [\App\Http\Controllers\UsersController::class, 'setTimeAssistant']);



    Route::post('/add_upload', [\App\Http\Controllers\UploadsController::class, 'store']);
    Route::post('/update_upload/{id}', [\App\Http\Controllers\UploadsController::class, 'update']);
    Route::delete('/delete_upload/{id}', [\App\Http\Controllers\UploadsController::class, 'destroy']);
});
