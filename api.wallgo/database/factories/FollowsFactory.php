<?php

namespace Database\Factories;

use App\Models\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Model>
 */
class FollowsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $follower = User::inRandomOrder()->first();
        $following = User::where('id', '!=', $follower?->id)->inRandomOrder()->first();

        return [
            'follower_id' => $follower?->id ?? 1,
            'following_id' => $following?->id ?? 2,
        ];
    }
}
