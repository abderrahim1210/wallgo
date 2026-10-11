<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EditProfile extends Controller
{
    public function edit(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'You need to login first for upload a photo'
            ], 401);
        }

        $user_id = Auth::id();
        $user = User::find($user_id);

        $data = $request->all();
        if ($data['avatar_url']) {
            $check = new \App\Http\Controllers\ValideImage();
            $valide = $check->valide($data['avatar_url']);

            if ($valide) {
                try {
                    $upload = new \App\Http\Controllers\CloudinaryActions();
                    $res = $upload->upload($data['avatar_url'], 'wallgo_avatar');
                    $user->avatar_url = $res['image_url'];
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Upload avatar failed : ' . $e->getMessage()
                    ]);
                }
            }
        }

        if ($data['banner_url']) {
            $check = new \App\Http\Controllers\ValideImage();
            $valide = $check->valide($data['banner_url']);

            if ($valide) {
                try {
                    $upload = new \App\Http\Controllers\CloudinaryActions();
                    $res = $upload->upload($data['banner_url'], 'wallgo_banner');
                    $user->banner_url = $res['image_url'];
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Upload avatar failed : ' . $e->getMessage()
                    ]);
                }
            }
        }

        $birthDate = $data['birth'];

        if (empty($birthDate) || "0000-00-00") {
            $birthDate = null;
        } else {
            $birthDate = $birthDate;
        }

        $user->fill($request->only([
            'name',
            'username',
            'email',
            'bio',
            'gender',
            'avatar_url',
            'banner_url',
            'status',
            'phone',
            'type',
            'location',
        ]));

        $user->name = $data['name'];
        $user->username = $data['username'];
        $email_exist = User::where('email', $user->email)->first();
        if ($email_exist) return response()->json(['success' => false, 'message' => 'Email already exist']);
        // if ($user->email !== $data['email']) {
        //     $user->email = $data['email'];
        // }
        $user->bio = $data['bio'];
        $user->status = $data['status'];
        $user->gender = $data['gender'];
        $user->location = $data['location'];


        if ($user->isDirty()) {
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Updated profile successfully'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No updated detected'
            ]);
        }
    }
}
