<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'username' => ['required', 'string', 'max:255', 'unique:' . User::class],
                'name'     => ['required', 'string', 'max:255'],
                'email'    => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
                'password' => ['required', 'string'],
                'year'     => ['required'],
                'month'    => ['required'],
                'day'      => ['required'],
            ]);

            $birth = sprintf('%04d-%02d-%02d', $request->year, $request->month, $request->day);

            $user = User::create([
                'username' => $request->username,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->string('password')),
                'birth' => $birth
            ]);

            event(new Registered($user));

            Auth::login($user);

            return response()->json([
                'success' => true,
                'message' => 'Account created successfully'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. try again later'
            ], 500);
        }
    }
}
