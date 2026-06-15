<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioVisit;
use Illuminate\Database\Eloquent\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioVisitorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/visitors', [
            'summary' => $this->summary(),
            'timeline' => $this->timeline(),
            'topCountries' => $this->topGroup('country', 8),
            'topCities' => $this->topGroup('city', 8),
            'devices' => $this->topGroup('device_type', 6),
            'browsers' => $this->topGroup('browser', 6),
            'recentVisits' => $this->recentVisits(),
        ]);
    }

    /**
     * @return array<string, int>
     */
    private function summary(): array
    {
        return [
            'totalVisits' => PortfolioVisit::query()->count(),
            'uniqueVisitors' => PortfolioVisit::query()
                ->whereNotNull('visitor_uuid')
                ->distinct('visitor_uuid')
                ->count('visitor_uuid'),
            'todayVisits' => PortfolioVisit::query()
                ->whereDate('visited_at', now()->toDateString())
                ->count(),
            'weekVisits' => PortfolioVisit::query()
                ->where('visited_at', '>=', now()->subDays(6)->startOfDay())
                ->count(),
            'countries' => PortfolioVisit::query()
                ->whereNotNull('country')
                ->distinct('country')
                ->count('country'),
            'bots' => PortfolioVisit::query()
                ->where('is_bot', true)
                ->count(),
        ];
    }

    /**
     * @return array<int, array{label: string, total: int}>
     */
    private function timeline(): array
    {
        $start = now()->subDays(13)->startOfDay();

        /** @var Collection<int, PortfolioVisit> $visits */
        $visits = PortfolioVisit::query()
            ->where('visited_at', '>=', $start)
            ->get(['visited_at']);

        $counts = $visits
            ->groupBy(fn (PortfolioVisit $visit): string => $visit->visited_at->toDateString())
            ->map->count();

        return collect(range(0, 13))
            ->map(function (int $offset) use ($start, $counts): array {
                $date = $start->copy()->addDays($offset);

                return [
                    'label' => $date->format('M j'),
                    'total' => (int) ($counts[$date->toDateString()] ?? 0),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, total: int}>
     */
    private function topGroup(string $column, int $limit): array
    {
        return PortfolioVisit::query()
            ->select($column)
            ->selectRaw('count(*) as total')
            ->whereNotNull($column)
            ->where($column, '!=', '')
            ->groupBy($column)
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(fn (PortfolioVisit $visit): array => [
                'label' => (string) $visit->{$column},
                'total' => (int) $visit->total,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function recentVisits(): array
    {
        return PortfolioVisit::query()
            ->latest('visited_at')
            ->limit(80)
            ->get()
            ->map(fn (PortfolioVisit $visit): array => [
                'id' => $visit->id,
                'ip_address' => $visit->ip_address,
                'device_type' => $visit->device_type,
                'device_name' => $visit->device_name,
                'platform' => $visit->platform,
                'browser' => $visit->browser,
                'country' => $visit->country,
                'country_code' => $visit->country_code,
                'region' => $visit->region,
                'city' => $visit->city,
                'location' => collect([$visit->city, $visit->region, $visit->country])
                    ->filter()
                    ->implode(', ') ?: ($visit->country_code ?: 'Unknown'),
                'referrer' => $visit->referrer,
                'url' => $visit->url,
                'is_bot' => $visit->is_bot,
                'user_agent' => $visit->user_agent,
                'visited_at' => $visit->visited_at?->toISOString(),
            ])
            ->all();
    }
}
