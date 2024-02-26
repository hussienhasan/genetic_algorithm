<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseUser;
use App\Models\Lecture;
use App\Models\Upload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UploadsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Upload::all();
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
        return Upload::create([
            'name' => $request->input('name'),
            'path' => $request->input('path'),
            'type' => $request->input('type'),
            'course_id' => $request->input('course_id'),


        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Upload $upload)
    {
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Upload $upload)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $upload = Upload::findOrFail($id);
        if ($upload->user_id == $request->user()->id) {
            $upload->update([
                'name' => $request->input('name'),
                'path' => $request->input('path'),
                'type' => $request->input('type'),
                'course_id' => $request->input('course_id'),


            ]);
            return response()->json(['message' => " the lecture has been updated successfully", 'lecture' => $upload]);;
        } else {
            return response('there has been some error ', 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $upload = Upload::findOrFail($id);
        if ($upload->user_id == $request->user()->id) {
            $upload->delete();
            return response('Upload deleted successfully', 200);
        } else {
            return response('there has been some error ', 400);
        }
    }
    public function viewMyUploadsAsAnAssistant(Request $request)
    {
        $user_id = $request->user()->id;
        $courseUser = CourseUser::where('user_id', '=', $user_id)->get();

        foreach ($courseUser as $course) {

            $cou_1 = Course::where('id', '=', $course->course->id)->get();
            foreach ($cou_1 as $c) {
                $uploads = Upload::where('course_id', '=', $c->id)->where('type', '=', 'session')->get();
                foreach ($uploads as $up) {
                    echo $up;
                }
            }
        }
    }
    // public function viewMyUploadsAsADoctor(Request $request)
    // {
    //     $user_id = $request->user()->id;
    //     $courseUser = CourseUser::where('user_id', '=', $user_id)->get();

    //     foreach ($courseUser as $course) {

    //         $cou_1 = Course::where('id', '=', $course->course->id)->get();
    //         foreach ($cou_1 as $c) {
    //             $uploads = Upload::where('course_id', '=', $c->id)->where('type', '=', 'lecture')->get();
    //             foreach ($uploads as $up) {
    //                 echo response()->json($up);
    //             }
    //         }
    //     }
    // }
    // this fuction is for student and doctor to show his lectures 
    public function uploadsAsLecture($id)
    {
        $uploads = Upload::where('course_id', '=', $id)->where('type', '=', 'lecture')->get();
        foreach ($uploads as $up) {
            echo response()->json($up);
        }
    }
        // this fuction is for student to show his sessions 

    public function uploadsAsSession($id)
    {
        $uploads = Upload::where('course_id', '=', $id)->where('type', '=', 'session')->get();
        foreach ($uploads as $up) {
            echo response()->json($up);
        }
    }
}
