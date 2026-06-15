<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SecurityEvent;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class SecurityEventController extends Controller
{
    public function __invoke(): Response
    {
        $events = SecurityEvent::query()
            ->latest('occurred_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/security', [
            'summary' => $this->summary(),
            'topIps' => $this->topGroup('ip_address', 8),
            'topTypes' => $this->topGroup('event_type', 8),
            'events' => $this->events($events),
            'pagination' => $this->pagination($events),
        ]);
    }

    /**
     * @return array<string, int>
     */
    private function summary(): array
    {
        return [
            'total' => SecurityEvent::query()->count(),
            'today' => SecurityEvent::query()->whereDate('occurred_at', now()->toDateString())->count(),
            'critical' => SecurityEvent::query()->where('severity', 'critical')->count(),
            'high' => SecurityEvent::query()->where('severity', 'high')->count(),
            'uniqueIps' => SecurityEvent::query()->whereNotNull('ip_address')->distinct('ip_address')->count('ip_address'),
        ];
    }

    /**
     * @return array<int, array{label: string, total: int}>
     */
    private function topGroup(string $column, int $limit): array
    {
        return SecurityEvent::query()
            ->select($column)
            ->selectRaw('count(*) as total')
            ->whereNotNull($column)
            ->where($column, '!=', '')
            ->groupBy($column)
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(fn (SecurityEvent $event): array => [
                'label' => (string) $event->{$column},
                'total' => (int) $event->total,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function events(LengthAwarePaginator $events): array
    {
        return $events
            ->getCollection()
            ->map(fn (SecurityEvent $event): array => [
                'id' => $event->id,
                'ip_address' => $event->ip_address,
                'method' => $event->method,
                'path' => $event->path,
                'url' => $event->url,
                'query_string' => $event->query_string,
                'referrer' => $event->referrer,
                'user_agent' => $event->user_agent,
                'event_type' => $event->event_type,
                'severity' => $event->severity,
                'score' => $event->score,
                'status_code' => $event->status_code,
                'reasons' => $event->reasons ?? [],
                'occurred_at' => $event->occurred_at?->toISOString(),
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function pagination(LengthAwarePaginator $events): array
    {
        return [
            'currentPage' => $events->currentPage(),
            'lastPage' => $events->lastPage(),
            'total' => $events->total(),
            'from' => $events->firstItem(),
            'to' => $events->lastItem(),
            'links' => collect($events->linkCollection())
                ->map(fn (array $link): array => [
                    'url' => $link['url'],
                    'label' => str((string) $link['label'])
                        ->replace('&laquo;', 'Previous')
                        ->replace('&raquo;', 'Next')
                        ->replace('pagination.previous', 'Previous')
                        ->replace('pagination.next', 'Next')
                        ->stripTags()
                        ->trim()
                        ->toString(),
                    'active' => (bool) $link['active'],
                ])
                ->values()
                ->all(),
        ];
    }
}
