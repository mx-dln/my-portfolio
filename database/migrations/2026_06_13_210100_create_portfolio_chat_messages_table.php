<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_conversation_id')->constrained()->cascadeOnDelete();
            $table->string('sender', 20);
            $table->text('body');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_chat_messages');
    }
};
