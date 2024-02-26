<?php

namespace App\Http\Controllers;

use App\Models\Utilities;
use Hamcrest\Util;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UtilitiesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return  Utilities::all();
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
        return Utilities::create([
           'name'=>$request->input('name'),
            'count'=>$request->input('count')
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Utilities $utilities)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Utilities $utilities)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $utilities=Utilities::findOrFail($id);
        $utilities->update([
            'name'=>$request->input('name'),
            'count'=>$request->input('count')
        ]);
        return $utilities;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        $utilities=Utilities::findOrFail($id);
        $flag = $utilities->delete();
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
