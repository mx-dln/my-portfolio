<?php

namespace Database\Seeders;

use App\Models\PortfolioExperience;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioSkillGroup;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'michaeld000021@gmail.com'],
            [
                'name' => 'Michael P. De Leon',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ],
        );

        PortfolioProfile::updateOrCreate(['id' => 1], [
            'name' => 'Michael P. De Leon',
            'role' => 'Full-Stack Software Engineer',
            'tagline' => 'I design and build production web, mobile, AI, GIS, and IoT systems for teams that need software to work in the real world.',
            'summary' => 'Full-stack software engineer with 4+ years of experience developing Laravel, Flutter, PHP, Python, MySQL, API, AI-powered, GIS, and IoT solutions for government, healthcare, education, e-commerce, and dengue surveillance projects.',
            'email' => 'michaeld000021@gmail.com',
            'phone' => '+63 955 0390 991',
            'location' => 'Cauayan City, Isabela, Philippines',
            'website_url' => 'https://www.mxdln.online',
            'github_url' => 'https://github.com/mx-dln',
            'linkedin_url' => 'https://linkedin.com/in/michael-de-leon-888035283',
            'availability' => 'Available for Laravel, React, Flutter, automation, and systems consulting projects.',
            'metrics' => [
                ['value' => '4+', 'label' => 'years building production systems'],
                ['value' => '12+', 'label' => 'web, mobile, AI, and IoT products'],
                ['value' => '5', 'label' => 'sectors shipped across'],
            ],
            'services' => [
                [
                    'title' => 'Business Platforms',
                    'body' => 'Laravel dashboards, booking systems, POS, e-commerce, RBAC, reporting, and workflow tools.',
                ],
                [
                    'title' => 'Mobile and Field Apps',
                    'body' => 'Flutter apps for health workers, GPS workflows, QR flows, push notifications, and data collection.',
                ],
                [
                    'title' => 'AI and Automation',
                    'body' => 'OpenAI, Ollama, LangChain, speech, text-to-speech, prompt engineering, and operational automations.',
                ],
                [
                    'title' => 'Deployment and Support',
                    'body' => 'VPS, shared hosting, DNS, API integrations, documentation, testing, and post-launch support.',
                ],
            ],
        ]);

        collect([
            [
                'title' => 'Community Dengue Early Warning System Mobile App',
                'category' => 'Mobile App',
                'year' => '2022-2023',
                'url' => null,
                'summary' => 'Dengue surveillance mobile app used by health workers to monitor OLTrap deployments, mosquito egg counts, and outbreak indicators in real time.',
                'impact' => 'Turned field collection into structured live surveillance data for public health response.',
                'stack' => ['Flutter', 'Laravel APIs', 'MySQL', 'Geolocation'],
                'status' => 'Shipped',
                'featured' => true,
            ],
            [
                'title' => 'Online Voting System',
                'category' => 'Web App',
                'year' => '2025',
                'url' => null,
                'summary' => 'Secure online voting platform for Isabela State University - Cauayan Campus student elections and vote tabulation.',
                'impact' => 'Supported election management with controlled access, tabulation, and a cleaner voting flow.',
                'stack' => ['Laravel', 'PHP', 'MySQL', 'RBAC'],
                'status' => 'Shipped',
                'featured' => true,
            ],
            [
                'title' => 'EnShopreneur',
                'category' => 'E-commerce',
                'year' => '2024-2025',
                'url' => 'https://enshopreneur.shop',
                'summary' => 'Multi-vendor e-commerce platform enabling entrepreneurs and small businesses to manage products, orders, and online sales.',
                'impact' => 'Gave sellers a centralized catalog, order, and transaction experience.',
                'stack' => ['Laravel', 'MySQL', 'Payments', 'Tailwind CSS'],
                'status' => 'Live',
                'featured' => true,
            ],
            [
                'title' => 'Vaccination Management System',
                'category' => 'Healthcare',
                'year' => '2024',
                'url' => 'https://district1-web-healthcare.online',
                'summary' => 'RHU platform for automated scheduling, patient management, and SMS notifications.',
                'impact' => 'Reduced manual vaccination tracking and improved patient follow-up workflows.',
                'stack' => ['Laravel', 'MySQL', 'SMS API', 'DataTables'],
                'status' => 'Live',
                'featured' => true,
            ],
            [
                'title' => 'C-DEWS Raspberry Pi Kiosk',
                'category' => 'IoT System',
                'year' => '2024-2025',
                'url' => null,
                'summary' => 'Raspberry Pi-powered kiosk for OLTrap registration, microscope image capture, and centralized dengue surveillance data collection.',
                'impact' => 'Connected on-site hardware workflows with central public health data systems.',
                'stack' => ['Raspberry Pi', 'Python', 'Camera Capture', 'Laravel APIs'],
                'status' => 'Shipped',
                'featured' => true,
            ],
            [
                'title' => 'Schedulera',
                'category' => 'Booking Platform',
                'year' => '2025-2026',
                'url' => 'https://schedulera.online',
                'summary' => 'Hourly hotel booking platform that streamlines room reservations and booking management for accommodation providers.',
                'impact' => 'Made short-stay reservation operations easier to manage from one system.',
                'stack' => ['Laravel', 'React', 'MySQL', 'FullCalendar'],
                'status' => 'Live',
                'featured' => true,
            ],
            [
                'title' => 'Synqbox Data Cleaner',
                'category' => 'Data Platform',
                'year' => '2025',
                'url' => 'https://datacleaner.synqbox.com/',
                'summary' => 'Data cleaning platform that automates dataset transformation, standardization, and preparation for analytics and reporting.',
                'impact' => 'Shortened messy data preparation workflows before reporting and analysis.',
                'stack' => ['Python', 'Laravel', 'Data Processing', 'APIs'],
                'status' => 'Live',
                'featured' => true,
            ],
            [
                'title' => 'C-DEWS OLTrap Mapping',
                'category' => 'Mobile GIS',
                'year' => '2026',
                'url' => null,
                'summary' => 'Mobile mapping workflow for OLTrap field registration, GPS tagging, and dengue surveillance location data.',
                'impact' => 'Improved field visibility for surveillance teams using location-aware mobile workflows.',
                'stack' => ['Flutter', 'GPS', 'Geolocation', 'APIs'],
                'status' => 'In progress',
                'featured' => false,
            ],
            [
                'title' => 'TCR Airconditioning',
                'category' => 'Business System',
                'year' => '2026',
                'url' => 'https://tcr-airconditioning.com/',
                'summary' => 'Business management system for service requests, quotations, transactions, and operational records.',
                'impact' => 'Moved service operations into a searchable, trackable business workflow.',
                'stack' => ['Laravel', 'MySQL', 'Quotations', 'Operations'],
                'status' => 'Live',
                'featured' => false,
            ],
            [
                'title' => 'LinkRide',
                'category' => 'Mobile Product',
                'year' => '2026',
                'url' => null,
                'summary' => 'Rider communication platform for real-time voice communication between motorcycle riders using wireless headsets and local network connectivity.',
                'impact' => 'Focuses on mobile-first rider group management and low-friction ride communication.',
                'stack' => ['Flutter', 'Realtime Audio', 'Local Network', 'UX'],
                'status' => 'In development',
                'featured' => false,
            ],
            [
                'title' => 'Vendora',
                'category' => 'POS Platform',
                'year' => '2026',
                'url' => null,
                'summary' => 'Modern POS platform for sales, inventory, products, customers, transaction records, analytics, and retail operations.',
                'impact' => 'Designed as a centralized business management system for efficient retail operations.',
                'stack' => ['Laravel', 'React', 'Inventory', 'Analytics'],
                'status' => 'In development',
                'featured' => false,
            ],
            [
                'title' => 'Orin AI',
                'category' => 'AI Assistant',
                'year' => '2026',
                'url' => null,
                'summary' => 'AI-powered virtual assistant for conversational support, productivity tasks, intelligent workflows, and automation experiments.',
                'impact' => 'Explores prompt engineering, AI integration, and workflow automation for everyday productivity.',
                'stack' => ['OpenAI API', 'Ollama', 'LangChain', 'Speech'],
                'status' => 'In development',
                'featured' => false,
            ],
        ])->each(function (array $project, int $index): void {
            PortfolioProject::updateOrCreate(
                ['title' => $project['title']],
                [...$project, 'sort_order' => $index + 1],
            );
        });

        collect([
            [
                'role' => 'Technical Aide VI',
                'organization' => 'Department of Science and Technology (DOST)',
                'period' => 'May 2025 - June 2026',
                'summary' => 'Supports software development lifecycle work, technical coordination, testing, documentation, and junior programming tasks for science and technology initiatives.',
                'bullets' => [
                    'Assist across requirements review, technical design, coding, testing, integration, release documentation, and support.',
                    'Support roundtable discussions, scientific meetings, and project logistics.',
                    'Perform junior computer programming tasks for government technology work.',
                ],
            ],
            [
                'role' => 'Laboratory Aide',
                'organization' => 'Business Intelligence Research and Development Center (DOST)',
                'period' => 'July 2022 - January 2023',
                'summary' => 'Contributed to data-driven software and analysis projects that help LGUs make more confident crisis-response decisions.',
                'bullets' => [
                    'Assisted in development of algorithms, programs, and software required by the project.',
                    'Supported data processing, analysis, technical reports, and research manuscripts.',
                    'Worked across SDLC phases from requirements to post-implementation support.',
                ],
            ],
            [
                'role' => 'On-the-Job Training',
                'organization' => 'BIRD-C, DOST Region II',
                'period' => 'January 2022 - May 2022',
                'summary' => 'Supported software applications, data-driven solutions, and research initiatives under the C-DEWS program.',
                'bullets' => [
                    'Participated in requirements gathering, technical design, coding, testing, deployment, and documentation.',
                    'Assisted in data processing, analysis, and technical report preparation.',
                    'Contributed to research and development work for dengue early warning systems.',
                ],
            ],
        ])->each(function (array $experience, int $index): void {
            PortfolioExperience::updateOrCreate(
                ['role' => $experience['role'], 'organization' => $experience['organization']],
                [...$experience, 'sort_order' => $index + 1],
            );
        });

        collect([
            ['name' => 'Languages', 'items' => ['PHP', 'JavaScript', 'Python', 'Dart', 'SQL']],
            ['name' => 'Frameworks', 'items' => ['Laravel', 'Livewire', 'React', 'Flutter', 'Flask', 'Tailwind CSS', 'Bootstrap', 'jQuery']],
            ['name' => 'Data', 'items' => ['MySQL', 'SQLite', 'Supabase', 'DataTables', 'Chart.js', 'FullCalendar']],
            ['name' => 'Backend and APIs', 'items' => ['REST APIs', 'JSON APIs', 'Webhooks', 'RBAC', 'API Integration']],
            ['name' => 'Mobile', 'items' => ['Flutter', 'Android Development', 'GPS', 'Geolocation', 'Push Notifications', 'QR Code Integration']],
            ['name' => 'AI and Automation', 'items' => ['OpenAI API', 'Ollama', 'LangChain', 'Prompt Engineering', 'Speech Recognition', 'Text-to-Speech']],
            ['name' => 'Cloud and Tools', 'items' => ['VPS Deployment', 'Shared Hosting', 'DNS', 'Git', 'GitHub', 'Composer', 'Node.js', 'Postman', 'Herd']],
        ])->each(function (array $group, int $index): void {
            PortfolioSkillGroup::updateOrCreate(
                ['name' => $group['name']],
                [...$group, 'sort_order' => $index + 1],
            );
        });
    }
}
