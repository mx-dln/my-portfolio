<?php

namespace Tests\Feature;

use App\Models\PortfolioConversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_portfolio_loads(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
    }

    public function test_portfolio_admin_requires_authentication(): void
    {
        $response = $this->get(route('admin.portfolio'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_open_portfolio_admin(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->get(route('admin.portfolio'));

        $response->assertOk();
    }

    public function test_visitor_can_start_a_portfolio_chat(): void
    {
        $response = $this->postJson(route('portfolio.chat.store'), [
            'visitor_name' => 'Client Example',
            'visitor_email' => 'client@example.com',
            'body' => 'I want to build a booking system.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure(['conversation_uuid', 'messages']);

        $this->assertDatabaseHas('portfolio_conversations', [
            'visitor_email' => 'client@example.com',
        ]);
        $this->assertDatabaseHas('portfolio_chat_messages', [
            'sender' => 'visitor',
            'body' => 'I want to build a booking system.',
        ]);
    }

    public function test_authenticated_user_can_reply_to_a_portfolio_chat(): void
    {
        $this->actingAs(User::factory()->create());

        $conversation = PortfolioConversation::query()->create([
            'visitor_name' => 'Client Example',
            'visitor_email' => 'client@example.com',
            'last_message_at' => now(),
        ]);

        $response = $this->post(route('admin.portfolio.conversations.reply', $conversation), [
            'body' => 'Thanks for reaching out. I will email you today.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('portfolio_chat_messages', [
            'portfolio_conversation_id' => $conversation->id,
            'sender' => 'admin',
            'body' => 'Thanks for reaching out. I will email you today.',
        ]);
    }
}
