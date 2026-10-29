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
        Schema::table('users', function (Blueprint $table) {
            $table->index('username');
        });
        
        Schema::table('posts', function (Blueprint $table) {
            $table->index('content');
            $table->index('user_id');
            $table->index('visibility');
            $table->index('schedule_time');
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->index('name');
        });
        
        Schema::table('pages', function (Blueprint $table) {
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tables', function (Blueprint $table) {
            //
        });
    }
};
