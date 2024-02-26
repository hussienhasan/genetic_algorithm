<?php

namespace App\Http\Controllers;

use App\Models\LectureStudentGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LecturesStudentsGroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return LectureStudentGroup::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return LectureStudentGroup::create([
            'lecture_id'=>$request->input('lecture_id'),
            'students_group_id'=>$request->input('students_group_id'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(LectureStudentGroup $lectureStudentGroup)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LectureStudentGroup $lectureStudentGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $lecture_student_group=LectureStudentGroup::findOrFail($id);
        $lecture_student_group->update([
            'lecture_id'=>$request->input('lecture_id'),
            'students_group_id'=>$request->input('students_group_id'),
        ]);
        return    $lecture_student_group;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        $lecture_student_group=LectureStudentGroup::findOrFail($id);
        $lecture_student_group->delete();
    }
}
