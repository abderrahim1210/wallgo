<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'post_id' => Post::inRandomOrder()->first()?->id ?? 1,
            'content' => fake()->text(200),
            'reply_to' => null,
            'is_edited' => fake()->boolean(15),
        ];
    }
}
