<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
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
            'content' => fake()->paragraphs(2, true),
            'schedule_time' => fake()->optional(0.2)->dateTimeBetween('now', '+1 week'), // 20% فرصة يكونscheduled
            'expires_at' => fake()->optional(0.1)->dateTimeBetween('+1 week', '+1 month'),
            'unlock_time' => fake()->optional(0.1)->dateTimeBetween('now', '+2 days'),
            'is_published' => fake()->boolean(85), // 85% منشورين
            'media_url' => fake()->optional(0.4)->imageUrl(800, 600, 'technics'), // صور عشوائية للبوست
            'post_type' => fake()->randomElement(['regular']),
            'capsule_status' => fake()->randomElement(['locked', 'unlocked', 'active']),
        ];
    }
}
