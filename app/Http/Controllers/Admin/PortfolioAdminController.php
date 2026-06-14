<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioConversation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioSkillGroup;
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
            'profile' => PortfolioProfile::query()->first(),
            'projects' => PortfolioProject::query()->orderBy('sort_order')->get(),
            'experiences' => PortfolioExperience::query()->orderBy('sort_order')->get(),
            'skillGroups' => PortfolioSkillGroup::query()->orderBy('sort_order')->get(),
            'conversations' => PortfolioConversation::query()
                ->with('messages')
                ->orderByDesc('last_message_at')
                ->orderByDesc('created_at')
                ->limit(30)
                ->get(),
        ]);
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
            'availability' => ['nullable', 'string', 'max:500'],
        ]);

        PortfolioProfile::query()->updateOrCreate(['id' => 1], $data);

        return back()->with('success', 'Profile updated.');
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

        return back()->with('success', 'Project added.');
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

        return back()->with('success', 'Project updated.');
    }

    public function destroyProject(PortfolioProject $project): RedirectResponse
    {
        $this->deleteProjectLogo($project);

        $project->delete();

        return back()->with('success', 'Project removed.');
    }

    public function replyToConversation(Request $request, PortfolioConversation $conversation): RedirectResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:3000'],
        ]);

        $conversation->messages()->create([
            'sender' => 'admin',
            'body' => $data['body'],
        ]);

        $conversation->forceFill(['last_message_at' => now()])->save();

        return back()->with('success', 'Reply sent.');
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
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
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
}
