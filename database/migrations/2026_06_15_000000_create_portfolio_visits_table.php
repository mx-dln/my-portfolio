<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_visits', function (Blueprint $table) {
            $table->id();
            $table->uuid('visitor_uuid')->nullable()->index();
            $table->string('ip_address', 45)->nullable()->index();
            $table->string('url')->nullable();
            $table->text('referrer')->nullable();
            $table->string('device_type')->nullable()->index();
            $table->string('device_name')->nullable();
            $table->string('platform')->nullable()->index();
            $table->string('browser')->nullable()->index();
            $table->string('country_code', 10)->nullable()->index();
            $table->string('country')->nullable()->index();
            $table->string('region')->nullable();
            $table->string('city')->nullable()->index();
            $table->string('timezone')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_bot')->default(false)->index();
            $table->text('user_agent')->nullable();
            $table->timestamp('visited_at')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_visits');
    }
};
