<?php

namespace App\Services;

use App\Models\SecurityEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SecurityWatcher
{
    /**
     * @return array{logged: bool, score: int, severity: string, reasons: array<int, string>}
     */
    public function record(Request $request, ?int $statusCode = null): array
    {
        if ($request->user() !== null || $request->is('admin/*') || $request->is('dashboard')) {
            return [
                'logged' => false,
                'score' => 0,
                'severity' => 'clean',
                'reasons' => [],
            ];
        }

        $analysis = $this->analyze($request, $statusCode);

        if ($analysis['score'] < 20) {
            return [
                ...$analysis,
                'logged' => false,
            ];
        }

        $fingerprint = sha1(implode('|', [
            $request->ip(),
            $request->method(),
            $request->path(),
            $request->getQueryString(),
            $statusCode,
            implode(',', $analysis['reasons']),
        ]));

        Cache::remember("security-event:{$fingerprint}", now()->addMinutes(2), function () use ($request, $statusCode, $analysis): bool {
            SecurityEvent::query()->create([
                'ip_address' => $this->ipAddress($request),
                'method' => $request->method(),
                'path' => '/'.$request->path(),
                'url' => $request->fullUrl(),
                'query_string' => $request->getQueryString(),
                'referrer' => $request->headers->get('referer'),
                'user_agent' => $request->userAgent(),
                'event_type' => $analysis['event_type'],
                'severity' => $analysis['severity'],
                'score' => $analysis['score'],
                'status_code' => $statusCode,
                'reasons' => $analysis['reasons'],
                'occurred_at' => now(),
            ]);

            return true;
        });

        return [
            ...$analysis,
            'logged' => true,
        ];
    }

    /**
     * @return array{event_type: string, score: int, severity: string, reasons: array<int, string>}
     */
    private function analyze(Request $request, ?int $statusCode): array
    {
        $score = 0;
        $reasons = [];
        $eventType = 'suspicious_request';
        $path = Str::lower('/'.$request->path());
        $url = Str::lower($request->fullUrl());
        $query = Str::lower((string) $request->getQueryString());
        $userAgent = Str::lower((string) $request->userAgent());
        $method = Str::upper($request->method());

        $knownProbePatterns = [
            '/.env' => 'Environment file probe',
            '/wp-' => 'WordPress probe on non-WordPress site',
            '/wordpress' => 'WordPress probe on non-WordPress site',
            '/phpmyadmin' => 'phpMyAdmin probe',
            '/pma' => 'phpMyAdmin shortcut probe',
            '/adminer' => 'Adminer probe',
            '/vendor/phpunit' => 'PHPUnit exploit probe',
            '/composer.' => 'Composer file probe',
            '/.git' => 'Git metadata probe',
            '/config.' => 'Configuration file probe',
            '/backup' => 'Backup file probe',
            '/shell' => 'Web shell probe',
            '/cgi-bin' => 'CGI probe',
            '/server-status' => 'Apache status probe',
        ];

        foreach ($knownProbePatterns as $needle => $reason) {
            if (str_contains($path, $needle)) {
                $score += 45;
                $reasons[] = $reason;
            }
        }

        if (preg_match('/\.\.|%2e%2e|%252e%252e|\/etc\/passwd|boot\.ini/i', $url)) {
            $score += 50;
            $reasons[] = 'Directory traversal probe';
            $eventType = 'path_traversal_probe';
        }

        if (preg_match('/union(\+|%20|\s)+select|information_schema|sleep\(|benchmark\(|base64_decode|<script|%3cscript/i', $url)) {
            $score += 50;
            $reasons[] = 'Injection-style payload detected';
            $eventType = 'injection_probe';
        }

        if (in_array($method, ['PUT', 'DELETE', 'TRACE', 'CONNECT'], true)) {
            $score += 35;
            $reasons[] = "Unusual {$method} method";
        }

        if ($statusCode === 404) {
            $score += 20;
            $reasons[] = 'Missing page request';
        }

        if ($statusCode !== null && $statusCode >= 500) {
            $score += 25;
            $reasons[] = 'Server error response';
        }

        if (str_contains($userAgent, 'sqlmap') || str_contains($userAgent, 'nikto') || str_contains($userAgent, 'acunetix') || str_contains($userAgent, 'nmap')) {
            $score += 60;
            $reasons[] = 'Known security scanner user agent';
            $eventType = 'scanner_probe';
        }

        if ($query !== '' && strlen($query) > 500) {
            $score += 15;
            $reasons[] = 'Very long query string';
        }

        return [
            'event_type' => $eventType,
            'score' => min(100, $score),
            'severity' => $this->severity($score),
            'reasons' => array_values(array_unique($reasons)),
        ];
    }

    private function severity(int $score): string
    {
        return match (true) {
            $score >= 80 => 'critical',
            $score >= 55 => 'high',
            $score >= 35 => 'medium',
            default => 'low',
        };
    }

    private function ipAddress(Request $request): ?string
    {
        $candidates = [
            $request->headers->get('CF-Connecting-IP'),
            $request->headers->get('X-Real-IP'),
            Str::of((string) $request->headers->get('X-Forwarded-For'))->explode(',')->first(),
            $request->ip(),
        ];

        foreach ($candidates as $candidate) {
            $ip = trim((string) $candidate);

            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }

        return null;
    }
}
