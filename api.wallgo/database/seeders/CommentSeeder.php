<?php

namespace Database\Seeders;

use App\Models\Comment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Comment::factory(50)->create()->each(function ($comment) {
            $repliesCount = rand(0, 2);

            for ($i = 0; $i < $repliesCount; $i++) {
                Comment::create([
                    'user_id' => \App\Models\User::inRandomOrder()->first()?->id ?? 1,
                    'post_id' => $comment->post_id,
                    'content' => fake()->text(150),
                    'reply_to' => $comment->id,
                    'is_edited' => false,
                ]);
            }
        });
    }
}
