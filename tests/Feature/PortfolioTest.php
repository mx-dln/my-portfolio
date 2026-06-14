<?php

namespace Tests\Feature;

use App\Models\PortfolioConversation;
use App\Models\PortfolioProject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_authenticated_user_can_open_portfolio_inbox_feed(): void
    {
        $this->actingAs(User::factory()->create());

        $conversation = PortfolioConversation::query()->create([
            'visitor_name' => 'Client Example',
            'visitor_email' => 'client@example.com',
            'last_message_at' => now(),
        ]);

        $conversation->messages()->create([
            'sender' => 'visitor',
            'body' => 'Do you build Laravel dashboards?',
        ]);

        $response = $this->get(route('admin.inbox.feed'));

        $response
            ->assertOk()
            ->assertJsonFragment([
                'visitor_email' => 'client@example.com',
                'body' => 'Do you build Laravel dashboards?',
            ]);
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

    public function test_authenticated_user_can_upload_svg_project_logo(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create());

        $svg = UploadedFile::fake()->createWithContent(
            'project-logo.svg',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>',
        );

        $response = $this->post(route('admin.portfolio.projects.store'), [
            'title' => 'SVG Logo Project',
            'category' => 'Web App',
            'year' => '2026',
            'summary' => 'A project with an SVG logo upload.',
            'impact' => 'Confirms SVG project logos are accepted.',
            'stack_text' => 'Laravel, React',
            'status' => 'Shipped',
            'featured' => '1',
            'logo' => $svg,
        ]);

        $response->assertRedirect();

        $project = PortfolioProject::query()->where('title', 'SVG Logo Project')->firstOrFail();

        $this->assertNotNull($project->logo_path);
        $this->assertStringEndsWith('.svg', $project->logo_path);
        Storage::disk('public')->assertExists($project->logo_path);
    }

    public function test_project_asset_logo_uses_public_asset_url(): void
    {
        $project = PortfolioProject::query()->create([
            'title' => 'Static Logo Project',
            'category' => 'Business System',
            'year' => '2026',
            'logo_path' => 'assets/image/project-logos/tcr-airconditioning.png',
            'summary' => 'A project using a committed logo asset.',
            'impact' => 'Keeps curated logos available without uploads.',
            'stack' => ['Laravel'],
            'status' => 'Live',
            'featured' => false,
            'sort_order' => 99,
        ]);

        $this->assertSame(
            '/assets/image/project-logos/tcr-airconditioning.png',
            $project->logo_url,
        );
    }
}
