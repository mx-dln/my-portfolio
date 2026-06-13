<?php

namespace Tests\Feature;

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
}
