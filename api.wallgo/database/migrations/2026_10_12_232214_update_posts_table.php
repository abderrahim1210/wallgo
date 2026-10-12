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
        Schema::table('posts', function (Blueprint $table) {
            $table->date('schedule_time')->nullable()->change();
            $table->date('expires_at')->nullable()->change();
            $table->date('unlock_time')->nullable()->change();
            $table->string('capsule_status')->nullable()->change();
            $table->boolean('is_published')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            //
        });
    }
};
