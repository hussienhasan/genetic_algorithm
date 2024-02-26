<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClassroomsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Classroom::all();
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
        return Classroom::create([
            'name'=>$request->input('name'),
            'type'=>$request->input('type'),
            'capacity'=>$request->input('capacity'),
            'datashow'=>$request->input('datashow'),

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Classroom $classroom): Response
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classroom $classroom): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
            
        $classroom = Classroom::findOrFail($id);

        $flag = $classroom->update([
            'name'=>$request->input('name'),
            'type'=>$request->input('type'),
            'capacity'=>$request->input('capacity'),
            'datashow'=>$request->input('datashow'),
        ]);

        if($flag)
        {
            
            return response()->json(['success'=>true,'message' => " the classroom has been updated successfully", 'classroom' => $classroom]);
        }
        else
        {
            return response()->json(['success'=>false]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classroom $classroom)
    {
        $flag = $classroom->delete();
        if($flag) 
        return response()->json(['success'=>true]);
        else
        return response()->json(['success'=>false]);

        }
}
