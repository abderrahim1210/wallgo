<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Like>
 */
class LikeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $liketableType = fake()->randomElement([
            Post::class,
            Comment::class,
        ]);

        $liketableId = match ($liketableType) {
            Post::class => Post::inRandomOrder()->first()?->id ?? 1,
            Comment::class => Comment::inRandomOrder()->first()?->id ?? 1,
        };

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'liketable_type' => $liketableType,
            'liketable_id' => $liketableId,
        ];
    }
}
