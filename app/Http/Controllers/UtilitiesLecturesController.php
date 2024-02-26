<?php

namespace App\Http\Controllers;

use App\Models\UtilityLecture;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UtilitiesLecturesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UtilityLecture::all();
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
        return UtilityLecture::create([
            'utility_id' => $request->input('utility_id'),
            'lecture_id' => $request->input('lecture_id'),


        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(UtilityLecture $utilityLecture)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UtilityLecture $utilityLecture)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $utiliy_lecture = UtilityLecture::findOrFail($id);
        $utiliy_lecture->update([
            'utility_id' => $request->input('utility_id'),
            'lecture_id' => $request->input('lecture_id'),
        ]);
        return $utiliy_lecture;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $utiliy_lecture = UtilityLecture::findOrFail($id);
        $utiliy_lecture->delete();
    }
}
