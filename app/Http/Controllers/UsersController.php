<?php

namespace App\Http\Controllers;

use App\Http\Resources\RolesResource;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UsersController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return (User::all());
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

        $user = User::create([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'role_id' => $request->input('role_id'),
            'password' => bcrypt($request->input('password')),
        ]);
        return  $user;
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new ($user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $user->update([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'role_id' => $request->input('role_id'),
            'password' => $request->input('password'),
        ]);
        return  $user;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $flag = $user->delete();
        if($flag) 
        return response()->json(['success'=>true]);
        else
        return response()->json(['success'=>false]);

    }
    // this function is for doctor to setup hus prefired time
    public function setTimeDoctor(Request $request, $id)
    {
        $user = User::find($id);

        $user->update([
            'first_best_time_id' => $request->input('fi'),
            'second_best_time_id' => $request->input('se'),
            'third_best_time_id' => $request->input('th')
        ]);
        return  $user;
    }

    // this function is for doctor to setup hus prefired time

    public function setTimeAssistant(Request $request, $id)
    {

        $user = User::find($id);

        $user->update([
            'first_best_time_id' => $request->input('fi'),
            'second_best_time_id' => $request->input('se'),
            'third_best_time_id' => $request->input('th')
        ]);
        return  $user;
    }

    public function doctors()
    {
        $res = User::all();
        $sz = count($res);
        $ans = [];
        for($i = 0; $i < $sz; $i++)
        {
            if($res[$i]->role->name === 'doctor') $ans[] = $res[$i];
        }

        return $ans;
    }

    public function addDoctor(Request $request)
    {

        $role = Role::where('name', '=', 'doctor')->get();

        $user = User::create([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'role_id' => $role[0]->id,
            'password' => bcrypt($request->input('password')),
        ]);
        return  $user;
    }

    public function assistants()
    {
        $res = User::all();
        $sz = count($res);
        $ans = [];
        for($i = 0; $i < $sz; $i++)
        {
            if($res[$i]->role->name === 'assistant') $ans[] = $res[$i];
        }

        return $ans;
    }

    public function addAssistant(Request $request)
    {

        $role = Role::where('name', '=', 'assistant')->get();

        $user = User::create([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'role_id' => $role[0]->id,
            'password' => bcrypt($request->input('password')),
        ]);
        return  $user;
    }

    function bestTimes($id)
    {
        $user = User::find($id);
        return  response([
            'first_best_time_id' => $user->first_best_time_id,
            'second_best_time_id' => $user->second_best_time_id,
            'third_best_time_id' => $user->third_best_time_id
            
        ]);


    }

    function editBestTime(Request $request, $id)
    {
        $user = User::find($id);
        if($request->best_time_num == 0)
            $user->first_best_time_id = $request->time_id;
        else if($request->best_time_num == 1)
            $user->second_best_time_id = $request->time_id;
        else if($request->best_time_num == 2)
            $user->third_best_time_id = $request->time_id;

        $user->save();

        return true;

    }
}

