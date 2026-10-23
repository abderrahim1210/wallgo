<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            // 'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'bio' => fake()->sentence(),
            'avatar_url' => fake()->imageUrl(200, 200, 'people'),
            'banner_url' => fake()->imageUrl(800, 400, 'nature'),
            // 'phone' => fake()->phoneNumber(),
            'visibility' => fake()->randomElement(['public', 'private']),
            'gender' => fake()->randomElement(['male', 'female']),
            'status' => fake()->randomElement(['active', 'offline', 'busy']),
            'location' => fake()->city(),
            'birth' => fake()->date('Y-m-d', '-18 years'),
            'status' => fake()->randomElement(['single','divorced','married'])
            // 'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
