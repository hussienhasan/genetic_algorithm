<?php

namespace App\Http\Controllers;

use App\Http\Resources\RolesResource;
use App\Models\Role;
use Faker\Factory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RolesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return (Role::all());
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
        $faker=Factory::create(1);
        $role=Role::create([
            'name'=>$request->input('name')
        ]);
        return  $role;
    }

    /**
     * Display the specified resource.
     */
    public function show( Role $role)
    {
        return new RolesResource($role);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $role->update([
           'name'=>$request->input('name'),
        ]);
        return new RolesResource($role);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return response(null,203);
    }
}
