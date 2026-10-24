<?php

namespace Database\Seeders;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FollowsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            $randomUsers = $users->where('id', '!=', $user->id)->random(rand(1, min(3, $users->count() - 1)));

            foreach ($randomUsers as $targetUser) {
                DB::table('follows')->updateOrInsert([
                    'follower_id' => $user->id,
                    'following_id' => $targetUser->id,
                ], [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
