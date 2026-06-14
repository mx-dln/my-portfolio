<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_profiles', function (Blueprint $table) {
            $table->string('facebook_url')->nullable()->after('linkedin_url');
            $table->string('instagram_url')->nullable()->after('facebook_url');
        });

        DB::table('portfolio_profiles')
            ->where('id', 1)
            ->update([
                'facebook_url' => 'https://www.facebook.com/kaelxdln',
                'instagram_url' => 'https://www.instagram.com/mikexdln/',
            ]);
    }

    public function down(): void
    {
        Schema::table('portfolio_profiles', function (Blueprint $table) {
            $table->dropColumn(['facebook_url', 'instagram_url']);
        });
    }
};
