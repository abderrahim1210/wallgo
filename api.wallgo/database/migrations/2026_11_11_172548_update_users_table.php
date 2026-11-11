<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function(Blueprint $table){


            $table->dropColumn('emails_likes_notifications');
            $table->dropColumn('new_follower_alerts');

            $table->boolean('emails_likes_notifications')->default(true);
            $table->boolean('new_follower_alerts')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
