<?php

namespace App\Http\Controllers;

use App\Models\StudentGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StudentGroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return StudentGroup::all();
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
        return StudentGroup::create([
            'year'=>$request->input('year'),
            'department'=>$request->input('department'),
            'category'=>$request->input('category'),
            'size'=>$request->input('size'),
            'division'=>$request->input('division'),

        ]);
    }
    /**
     * Display the specified resource.
     */
    public function show(StudentGroup $studentGroup): Response
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentGroup $studentGroup): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $student_group=StudentGroup::findOrFail($id);
        $flag = $student_group->update([
            'year'=>$request->input('year'),
            'department'=>$request->input('department'),
            'category'=>$request->input('category'),
            'size'=>$request->input('size'),
            'division'=>$request->input('division'),

        ]);
        if($flag) 
        return response()->json(['success'=>true]);
        else
        return response()->json(['success'=>false]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $student_group=StudentGroup::findOrFail($id);
        $flag = $student_group->delete();
        if($flag) 
        return response()->json(['success'=>true]);
        else
        return response()->json(['success'=>false]);
    }
}
