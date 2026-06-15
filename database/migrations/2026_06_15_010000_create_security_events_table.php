<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_events', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address')->nullable()->index();
            $table->string('method', 12);
            $table->string('path', 1000);
            $table->text('url')->nullable();
            $table->text('query_string')->nullable();
            $table->text('referrer')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('event_type')->index();
            $table->string('severity', 24)->index();
            $table->unsignedSmallInteger('score')->default(0);
            $table->unsignedSmallInteger('status_code')->nullable()->index();
            $table->json('reasons')->nullable();
            $table->timestamp('occurred_at')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_events');
    }
};
