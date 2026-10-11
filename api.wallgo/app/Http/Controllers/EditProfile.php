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
        if (!empty($data['avatar_url']) && str_starts_with($data['avatar_url'], 'data:image')) {
            $check = new \App\Http\Controllers\ValideImage();
            $valide = $check->valide($data['avatar_url']);

            if ($valide) {
                try {
                    $upload = new \App\Http\Controllers\CloudinaryActions();
                    $res = $upload->upload($data['avatar_url'], 'wallgo_avatar');
                    $data['avatar_url'] = $res['image_url'] ?? $res['secure_url'] ?? $res['url'];
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Upload avatar failed : ' . $e->getMessage()
                    ]);
                }
            } else {
                unset($data['avatar_url']);
            }
        } else {
            unset($data['avatar_url']);
        }

        if (!empty($data['banner_url']) && str_starts_with($data['banner_url'], 'data:image')) {
            $check = new \App\Http\Controllers\ValideImage();
            $valide = $check->valide($data['banner_url']);

            if ($valide) {
                try {
                    $upload = new \App\Http\Controllers\CloudinaryActions();
                    $res = $upload->upload($data['banner_url'], 'wallgo_banner');
                    $data['banner_url'] = $res['image_url'] ?? $res['secure_url'] ?? $res['url'];
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Upload banner failed : ' . $e->getMessage()
                    ]);
                }
            } else {
                unset($data['banner_url']);
            }
        } else {
            unset($data['banner_url']);
        }


        $birthDate = null;
        if (!empty($data['birth']) && $data['birth'] !== "0000-00-00" && $data['birth'] !== "null") {
            $birthDate = $data['birth'];
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
        if (!empty($data['email']) && $data['email'] !== $user->email) {
            $email_exist = User::where('email', $data['email'])->where('id', '!=', $user->id)->first();
            if ($email_exist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email already exists'
                ]);
            }
            $user->email = $data['email'];
        }
        $user->bio = $data['bio'];
        $user->status = $data['status'];
        $user->gender = $data['gender'];
        $user->location = $data['location'];
        $user->avatar_url = $data['avatar_url'] ?? $user->avatar_url;
        $user->banner_url = $data['banner_url'] ?? $user->banner_url;
        $user->birth = $birthDate;


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
