<?php

namespace App\Http\Controllers\ApiReg;

use App\Http\Controllers\ApiReg\BaseController as BaseController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class RegisterController extends BaseController
{
    //
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password',


        ]);
        if ($validator->fails()) {
            return $this->sendError('validation error', $validator->errors());

        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $success['token'] = $user->createToken('MyApp')->accessToken;
        $success['name'] = $user->first_name;
        return $this->sendResponse($success, 'User register successfully');


    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'

        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response([
                'message' => 'the provided credential are not correct '
            ]);


        }
        $token = $user->createToken('MyApp')->accessToken;
        return response([
            'id'=>$user->id ,
            'first_name'=>$user->first_name ,
            'last_name'=>$user->last_name ,
            'role' => $user->role->name,
            'token' => $token
        ]);


    }
//if (Auth::guard('web')->attempt(['email' => $request->email, 'password' => $request->password,]))
//{
//$user = Users::where('Email', $username)->where('Password', $password)->where('UserStatus', config('global.active'))->first();
//if ($user)
//{
//$success['token'] = $user->createToken('MyApp')->accessToken;
//return response()->json(['success' => $success], $this->successStatus);
//$user = Auth::user();
//$success['token'] = $user->createToken('MyApp')->accessToken;
//$success['name'] = $user->first_name;
//return $this->sendResponse($success, 'User register successfully ');
//}
//
//else {
//    return $this->sendError('Unauthorized', ['error' => 'Unauthorized']);
//}
//
//
//}

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response([
            'success' => true,
            'message' => 'logged out',

        ]);

    }


}
