<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioConversation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioSkillGroup;
use App\Models\PortfolioVisit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/portfolio', [
            'counts' => [
                'projects' => PortfolioProject::query()->count(),
                'featured' => PortfolioProject::query()->where('featured', true)->count(),
                'experiences' => PortfolioExperience::query()->count(),
                'skillGroups' => PortfolioSkillGroup::query()->count(),
                'messages' => PortfolioConversation::query()->count(),
                'visits' => PortfolioVisit::query()->count(),
            ],
        ]);
    }

    public function hero(): Response
    {
        return Inertia::render('admin/hero', [
            'profile' => $this->profileRecord(),
        ]);
    }

    public function projects(): Response
    {
        return Inertia::render('admin/projects', [
            'projects' => PortfolioProject::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function capability(): Response
    {
        return Inertia::render('admin/capability', [
            'profile' => $this->profileRecord(),
            'skillGroups' => PortfolioSkillGroup::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function experience(): Response
    {
        return Inertia::render('admin/experience', [
            'experiences' => PortfolioExperience::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('admin/contact', [
            'profile' => $this->profileRecord(),
        ]);
    }

    public function updateHero(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'tagline' => ['required', 'string', 'max:500'],
            'summary' => ['required', 'string', 'max:1200'],
            'availability' => ['nullable', 'string', 'max:500'],
        ]);

        $this->profileRecord()->update($data);

        return $this->backWithToast('Hero updated.');
    }

    public function updateContact(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
        ]);

        $this->profileRecord()->update($data);

        return $this->backWithToast('Contact links updated.');
    }

    public function updateCapability(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'services' => ['array'],
            'services.*.title' => ['nullable', 'string', 'max:255'],
            'services.*.body' => ['nullable', 'string', 'max:1200'],
            'skill_groups' => ['array'],
            'skill_groups.*.id' => ['nullable', 'integer', 'exists:portfolio_skill_groups,id'],
            'skill_groups.*.name' => ['nullable', 'string', 'max:255'],
            'skill_groups.*.items_text' => ['nullable', 'string', 'max:1200'],
        ]);

        $services = collect($data['services'] ?? [])
            ->map(fn (array $service): array => [
                'title' => trim((string) ($service['title'] ?? '')),
                'body' => trim((string) ($service['body'] ?? '')),
            ])
            ->filter(fn (array $service): bool => $service['title'] !== '' || $service['body'] !== '')
            ->values()
            ->all();

        $this->profileRecord()->update(['services' => $services]);

        $retainedSkillGroupIds = collect($data['skill_groups'] ?? [])
            ->map(function (array $group): array {
                return [
                    'id' => $group['id'] ?? null,
                    'name' => trim((string) ($group['name'] ?? '')),
                    'items' => collect(explode(',', (string) ($group['items_text'] ?? '')))
                        ->map(fn (string $item): string => trim($item))
                        ->filter()
                        ->values()
                        ->all(),
                ];
            })
            ->filter(fn (array $group): bool => $group['name'] !== '')
            ->values()
            ->map(function (array $group, int $index): int {
                $skillGroup = PortfolioSkillGroup::query()->updateOrCreate(
                    ['id' => $group['id']],
                    [
                        'name' => $group['name'],
                        'items' => $group['items'],
                        'sort_order' => $index + 1,
                    ],
                );

                return $skillGroup->id;
            });

        PortfolioSkillGroup::query()
            ->when(
                $retainedSkillGroupIds->isNotEmpty(),
                fn ($query) => $query->whereNotIn('id', $retainedSkillGroupIds),
            )
            ->delete();

        return $this->backWithToast('Capability map updated.');
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'tagline' => ['required', 'string', 'max:500'],
            'summary' => ['required', 'string', 'max:1200'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'availability' => ['nullable', 'string', 'max:500'],
        ]);

        PortfolioProfile::query()->updateOrCreate(['id' => 1], $data);

        return $this->backWithToast('Profile updated.');
    }

    public function storeExperience(Request $request): RedirectResponse
    {
        $data = $this->experienceData($request);
        $data['sort_order'] = (PortfolioExperience::query()->max('sort_order') ?? 0) + 1;

        PortfolioExperience::query()->create($data);

        return $this->backWithToast('Experience added.');
    }

    public function updateExperience(Request $request, PortfolioExperience $experience): RedirectResponse
    {
        $experience->update($this->experienceData($request));

        return $this->backWithToast('Experience updated.');
    }

    public function destroyExperience(PortfolioExperience $experience): RedirectResponse
    {
        $experience->delete();

        return $this->backWithToast('Experience removed.');
    }

    public function storeProject(Request $request): RedirectResponse
    {
        $data = $this->projectData($request);
        $logoPath = $this->projectLogoPath($request);

        if ($logoPath !== null) {
            $data['logo_path'] = $logoPath;
        }

        $data['sort_order'] = (PortfolioProject::query()->max('sort_order') ?? 0) + 1;

        PortfolioProject::query()->create($data);

        return $this->backWithToast('Project added.');
    }

    public function updateProject(Request $request, PortfolioProject $project): RedirectResponse
    {
        $data = $this->projectData($request);
        $logoPath = $this->projectLogoPath($request);

        if ($logoPath !== null) {
            $this->deleteProjectLogo($project);
            $data['logo_path'] = $logoPath;
        }

        $project->update($data);

        return $this->backWithToast('Project updated.');
    }

    public function destroyProject(PortfolioProject $project): RedirectResponse
    {
        $this->deleteProjectLogo($project);

        $project->delete();

        return $this->backWithToast('Project removed.');
    }

    public function replyToConversation(Request $request, PortfolioConversation $conversation): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:3000'],
        ]);

        $conversation->messages()->create([
            'sender' => 'admin',
            'body' => $data['body'],
        ]);

        $conversation->forceFill(['last_message_at' => now()])->save();

        if ($request->wantsJson()) {
            $conversation->setRelation(
                'messages',
                $conversation->messages()
                    ->reorder()
                    ->latest('id')
                    ->limit(10)
                    ->get(['id', 'portfolio_conversation_id', 'sender', 'body', 'created_at'])
                    ->sortBy('id')
                    ->values(),
            );

            return response()->json([
                'conversation' => $conversation,
            ]);
        }

        return $this->backWithToast('Reply sent.');
    }

    private function backWithToast(string $message): RedirectResponse
    {
        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $message,
        ]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function projectData(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'year' => ['required', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:255'],
            'summary' => ['required', 'string', 'max:1200'],
            'impact' => ['nullable', 'string', 'max:1200'],
            'stack_text' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'string', 'max:255'],
            'featured' => ['boolean'],
        ]);

        $data['stack'] = collect(explode(',', $data['stack_text'] ?? ''))
            ->map(fn (string $item): string => trim($item))
            ->filter()
            ->values()
            ->all();

        unset($data['stack_text']);

        $data['featured'] = (bool) ($data['featured'] ?? false);

        return $data;
    }

    private function projectLogoPath(Request $request): ?string
    {
        $request->validate([
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:4096'],
        ]);

        if (! $request->hasFile('logo')) {
            return null;
        }

        return $request->file('logo')->store('portfolio/project-logos', 'public');
    }

    private function deleteProjectLogo(PortfolioProject $project): void
    {
        if (! $project->logo_path) {
            return;
        }

        Storage::disk('public')->delete($project->logo_path);
    }

    private function profileRecord(): PortfolioProfile
    {
        return PortfolioProfile::query()->firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Michael P. De Leon',
                'role' => 'Full-Stack Software Engineer',
                'tagline' => 'I design and build production web, mobile, AI, GIS, and IoT systems for teams that need software to work in the real world.',
                'summary' => 'Full-stack software engineer building Laravel, Flutter, PHP, Python, MySQL, API, AI-powered, GIS, and IoT solutions.',
                'email' => 'michaeld000021@gmail.com',
                'phone' => '+63 955 0390 991',
                'location' => 'Cauayan City, Isabela, Philippines',
                'website_url' => 'https://www.mxdln.online',
                'github_url' => 'https://github.com/mx-dln',
                'linkedin_url' => 'https://linkedin.com/in/michael-de-leon-888035283',
                'facebook_url' => 'https://www.facebook.com/kaelxdln',
                'instagram_url' => 'https://www.instagram.com/mikexdln/',
                'availability' => 'Available for Laravel, React, Flutter, automation, and systems consulting projects.',
            ],
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function experienceData(Request $request): array
    {
        $data = $request->validate([
            'role' => ['required', 'string', 'max:255'],
            'organization' => ['required', 'string', 'max:255'],
            'period' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:1200'],
            'bullets_text' => ['nullable', 'string', 'max:2000'],
        ]);

        $data['bullets'] = collect(preg_split('/\r\n|\r|\n/', (string) ($data['bullets_text'] ?? '')))
            ->map(fn (string $bullet): string => trim($bullet))
            ->filter()
            ->values()
            ->all();

        unset($data['bullets_text']);

        return $data;
    }
}
