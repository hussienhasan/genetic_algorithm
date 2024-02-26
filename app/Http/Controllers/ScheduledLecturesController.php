<?php

namespace App\Http\Controllers;

use App\Models\ScheduledLecture;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ScheduledLecturesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ScheduledLecture::all();
        
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
        ScheduledLecture::truncate();
        $dataArray = $request->json()->all();

        foreach ($dataArray as $dataObject) {
            $xyz = new ScheduledLecture;
            $xyz->time_id = $dataObject['x'];
            $xyz->classroom_id = $dataObject['y'];
            $xyz->lecture_id = $dataObject['z'];
            $xyz->save();
        }
        return true;
    }

    /**
     * Display the specified resource.
     */
    public function show(ScheduledLecture $scheduledLecture): Response
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScheduledLecture $scheduledLecture): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $scheduledL_lecture=ScheduledLecture::findOrFail($id);
        $scheduledL_lecture->update([
            'time_id'=>$request->input('time_id'),
            'classroom_id'=>$request->input('classroom_id'),
            'lecture_id'=>$request->input('lecture_id')

        ]);
        return$scheduledL_lecture;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        ScheduledLecture::truncate();
        return true;


    }
}
