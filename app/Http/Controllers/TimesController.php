<?php

namespace App\Http\Controllers;

use App\Models\time;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TimesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Time::all();
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
        return Time::create([
            'day'=> $request->input('day'),
            'start_time'=> $request->input('start_time'),
            'end_time'=> $request->input('end_time'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(time $time): Response
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(time $time): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,  $id)
    {

        $time = Time::findOrFail($id);
        $flag = $time->update([
            'day'=> $request->input('day'),
            'start_time'=> $request->input('start_time'),
            'end_time'=> $request->input('end_time'),
        ]);

        if($flag)
        {
            
            return response()->json(['success'=>true,'message' => " the lecture has been updated successfully", 'time' => $time]);
        }
        else
        {
            return response()->json(['success'=>false]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $time = Time::findOrFail($id);

        $flag = $time->delete();
       
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
}
