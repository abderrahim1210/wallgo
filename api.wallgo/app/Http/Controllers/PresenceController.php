<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function ping(Request $request)
    {
        $user = $request->user();

        if (!$user->last_seen_at || $user->last_seen_at->lt(now()->subSeconds(30))) {
            $user->forceFill([
                'last_seen_at' => now(),
            ])->save();
        }

        return response()->json([
            'success' => true,
            'last_seen_at' => $user->last_seen_at?->toISOString(),
        ]);
    }

    public function offline(Request $request)
    {
        $user = $request->user();

        $user->forceFill([
            'last_seen_at' => now(),
        ])->save();

        return response()->json([
            'success' => true,
        ]);
    }
}
