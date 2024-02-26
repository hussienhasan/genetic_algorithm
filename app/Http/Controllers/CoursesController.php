<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseUser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CoursesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Course::all();

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $course = Course::create([
            'name' => $request->input('name'),
            'year' => $request->input('year')

        ]);
        return $course;


    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course){

        
    }
        //
    

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $flag = $course->update([
            'name' => $request->input('name'),
            'year' => $request->input('year')
        ]);
        if($flag) 
        return response()->json(['success'=>true]);
        else
        return response()->json(['success'=>false]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $flag = $course->delete();
        if($flag) 
        return response()->json(['success'=>true]);
        else
        return response()->json(['success'=>false]);

    }

    public function viewMyCourses(Request $request)
    {
        $user_id = $request->user()->id;
        $courseUser = CourseUser::where('user_id', '=', $user_id)->get();
        foreach ($courseUser as $course) {
            echo $course->course;
        }


    }




}
