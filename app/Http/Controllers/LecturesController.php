<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseUser;
use App\Models\Lecture;
use App\Models\LectureStudentGroup;
use App\Models\UtilityLecture;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LecturesController extends Controller
{

    public function normalLectures()
    {
        return Lecture::all();

    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lectures = Lecture::all();
        $res =[];
        $sz = count($lectures);
        for($i = 0; $i < $sz; $i++)
        {
            $stGroups="";
            $stgarr = $lectures[$i]->lecturesStudentsGroups;
            $stgSz = count($stgarr);
            for($j = 0; $j < $stgSz; $j++)
            {
                $item = "";
                if($stgarr[$j]->students_group && $stgarr[$j]->students_group->year)
                {
                    $ans = $stgarr[$j]->students_group->year;
                    $item .= "السنة:$ans";
                }
                if($stgarr[$j]->students_group && $stgarr[$j]->students_group->department)
                {
                    $ans = $stgarr[$j]->students_group->department;
                    $item .= " - القسم:$ans";
                }
                if($stgarr[$j]->students_group && $stgarr[$j]->students_group->division)
                {
                    $ans = $stgarr[$j]->students_group->division ;
                    $item .= " - الشعبة:$ans";
                }
                if($stgarr[$j]->students_group && $stgarr[$j]->students_group->category)
                {
                    $ans = $stgarr[$j]->students_group->category;
                    $item .= " - الفئة:$ans";
                }
                if($item != "") $item .= "<br>";
                $stGroups .= $item;
            }

            $lecUtilities="";
            $arr = $lectures[$i]->utilitiesLectures;
            $utilitySz = count($arr);
            for($j = 0; $j < $utilitySz; $j++)
            {
                if($arr[$j]->utility){
                $ans = $arr[$j]->utility->name;
                $item = "$ans";

                $lecUtilities .= "$item <br>";
                }
            }
            
            $ans= response(['id'=>$lectures[$i]->id,'first_name' => $lectures[$i]->user->first_name, 'last_name' => $lectures[$i]->user->last_name, 'course' => $lectures[$i]->course?->name, 'lecture_type' => $lectures[$i]->lecture_type, 'students_groups' => $stGroups, 'utilities'=> $lecUtilities]);

            $res[]= $ans;
        }
        
        return $res;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return Lecture::create([
            'user_id' => $request->input('user_id'),
            'course_id' => $request->input('course_id'),
            'lecture_type' => $request->input('lecture_type'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lecture $lecture): Response
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lecture $lecture): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $lecture = Lecture::findOrFail($id);
        if ($lecture->user_id == $request->user()->id) {

            $lecture->update([
                'user_id' => $request->input('user_id'),
                'course_id' => $request->input('course_id'),
                'lecture_type' => $request->input('lecture_type'),
                'first_best_time_id' => $request->input('first_best_time_id'),
                'second_best_time_id' => $request->input('second_best_time_id'),
                'third_best_time_id' => $request->input('third_best_time_id'),
            ]);
            return response()->json(['message' => " the lecture has been updated successfully", 'lecture' => $lecture]);
        } else {
            return response('there has been some error ', 400);

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $lecture = Lecture::findOrFail($id);
        
        $flag = $lecture->delete();
       
        if($flag)
        {
            
            return response([
                'success' => true,
                'message' => 'Deleted',
    
            ]);
        }
        else{
            return response([
                'success' => false,
                'message' => ' Faild to delete',
    
            ]);
        }

    }

    public function viewMylectures(Request $request)
    {
        $user_id = $request->user()->id;
        $courseUser = CourseUser::where('user_id', '=', $user_id)->get();

        foreach ($courseUser as $course) {

            $cou_1 = Course::where('id', '=', $course->course->id)->get();
            foreach ($cou_1 as $c) {
                echo $c->lectures;
            }
        }

    }
}
