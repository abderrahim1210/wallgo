<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $posts = Post::all();

        foreach ($users as $user) {
            $randomPosts = $posts->random(rand(1, min(5, $posts->count())));

            foreach ($randomPosts as $post) {
                DB::table('likes')->updateOrInsert([
                    'user_id' => $user->id,
                    'liketable_type' => Post::class,
                    'liketable_id' => $post->id,
                ], [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
