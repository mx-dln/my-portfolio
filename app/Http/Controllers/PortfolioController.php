<?php

namespace App\Http\Controllers;

use App\Models\PortfolioExperience;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioSkillGroup;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('welcome', [
            'profile' => PortfolioProfile::query()->first() ?? $this->fallbackProfile(),
            'projects' => PortfolioProject::query()
                ->orderBy('sort_order')
                ->orderByDesc('featured')
                ->get(),
            'experiences' => PortfolioExperience::query()->orderBy('sort_order')->get(),
            'skillGroups' => PortfolioSkillGroup::query()->orderBy('sort_order')->get(),
        ]);
    }

    private function fallbackProfile(): array
    {
        return [
            'name' => 'Michael P. De Leon',
            'role' => 'Full-Stack Software Engineer',
            'tagline' => 'I design and build production web, mobile, AI, GIS, and IoT systems for teams that need software to work in the real world.',
            'summary' => 'Laravel, Flutter, PHP, Python, MySQL, APIs, AI automation, GIS, and IoT projects for government, healthcare, education, commerce, and operations teams.',
            'email' => 'michaeld000021@gmail.com',
            'phone' => '+63 955 0390 991',
            'location' => 'Cauayan City, Isabela, Philippines',
            'website_url' => 'https://www.mxdln.online',
            'github_url' => 'https://github.com/mx-dln',
            'linkedin_url' => 'https://linkedin.com/in/michael-de-leon-888035283',
            'facebook_url' => 'https://www.facebook.com/kaelxdln',
            'instagram_url' => 'https://www.instagram.com/mikexdln/',
            'availability' => 'Available for selected software projects.',
            'metrics' => [
                ['value' => '4+', 'label' => 'years building production systems'],
                ['value' => '12+', 'label' => 'products and platforms'],
                ['value' => '5', 'label' => 'sectors shipped across'],
            ],
            'services' => [],
        ];
    }
}
