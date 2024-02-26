<?php

namespace App\Http\Controllers;

use App\Models\CourseUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CourseUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CourseUser::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $courseUser = CourseUser::create([

            'course_id' => $request->input('course_id'),
            'user_id' => $request->input('user_id'),
        ]);
        return $courseUser;
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseUser $courseUser): Response
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseUser $courseUser): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $courseUser = CourseUser::findOrFail($id);
        $courseUser->update([
                'course_id' => $request->input('course_id'),
                'user_id' => $request->input('user_id')
        ]);
        return $courseUser;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        CourseUser::findOrFail($id)->delete();


        return response(null,204);
    }
}
