<?php

namespace App\Services;

use App\Models\PortfolioVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class VisitorTracker
{
    private const VISITOR_COOKIE = 'portfolio_visitor_id';

    public function record(Request $request): void
    {
        if ($request->user()) {
            return;
        }

        $visitorUuid = $request->cookie(self::VISITOR_COOKIE) ?: (string) Str::uuid();

        if (! $request->cookie(self::VISITOR_COOKIE)) {
            Cookie::queue(Cookie::forever(self::VISITOR_COOKIE, $visitorUuid));
        }

        $ipAddress = $this->ipAddress($request);
        $userAgent = (string) $request->userAgent();
        $device = $this->device($userAgent);
        $location = $this->location($ipAddress, $request);

        PortfolioVisit::query()->create([
            'visitor_uuid' => $visitorUuid,
            'ip_address' => $ipAddress,
            'url' => $request->fullUrl(),
            'referrer' => $request->headers->get('referer'),
            'device_type' => $device['device_type'],
            'device_name' => $device['device_name'],
            'platform' => $device['platform'],
            'browser' => $device['browser'],
            'country_code' => $location['country_code'] ?? null,
            'country' => $location['country'] ?? null,
            'region' => $location['region'] ?? null,
            'city' => $location['city'] ?? null,
            'timezone' => $location['timezone'] ?? null,
            'latitude' => $location['latitude'] ?? null,
            'longitude' => $location['longitude'] ?? null,
            'is_bot' => $device['is_bot'],
            'user_agent' => $userAgent ?: null,
            'visited_at' => now(),
        ]);
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

    /**
     * @return array<string, mixed>
     */
    private function device(string $userAgent): array
    {
        $agent = Str::lower($userAgent);
        $isBot = (bool) preg_match('/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|monitoring|uptime|scanner/i', $userAgent);

        $deviceType = match (true) {
            $isBot => 'Bot',
            str_contains($agent, 'ipad') || str_contains($agent, 'tablet') => 'Tablet',
            str_contains($agent, 'mobile') || str_contains($agent, 'iphone') || str_contains($agent, 'android') => 'Mobile',
            default => 'Desktop',
        };

        $deviceName = match (true) {
            str_contains($agent, 'iphone') => 'iPhone',
            str_contains($agent, 'ipad') => 'iPad',
            str_contains($agent, 'android') && str_contains($agent, 'mobile') => 'Android phone',
            str_contains($agent, 'android') => 'Android tablet',
            str_contains($agent, 'windows') => 'Windows PC',
            str_contains($agent, 'macintosh') || str_contains($agent, 'mac os') => 'Mac',
            str_contains($agent, 'linux') => 'Linux device',
            $isBot => 'Crawler',
            default => 'Unknown device',
        };

        $platform = match (true) {
            str_contains($agent, 'iphone') || str_contains($agent, 'ipad') || str_contains($agent, 'ios') => 'iOS',
            str_contains($agent, 'android') => 'Android',
            str_contains($agent, 'windows') => 'Windows',
            str_contains($agent, 'macintosh') || str_contains($agent, 'mac os') => 'macOS',
            str_contains($agent, 'cros') => 'ChromeOS',
            str_contains($agent, 'linux') => 'Linux',
            default => 'Unknown OS',
        };

        $browser = match (true) {
            $isBot => 'Bot',
            str_contains($agent, 'edg/') => 'Microsoft Edge',
            str_contains($agent, 'opr/') || str_contains($agent, 'opera') => 'Opera',
            str_contains($agent, 'samsungbrowser') => 'Samsung Internet',
            str_contains($agent, 'firefox') => 'Firefox',
            str_contains($agent, 'chrome') || str_contains($agent, 'crios') => 'Chrome',
            str_contains($agent, 'safari') => 'Safari',
            default => 'Unknown browser',
        };

        return [
            'device_type' => $deviceType,
            'device_name' => $deviceName,
            'platform' => $platform,
            'browser' => $browser,
            'is_bot' => $isBot,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function location(?string $ipAddress, Request $request): array
    {
        $cloudflareCountry = $request->headers->get('CF-IPCountry');

        if ($cloudflareCountry && $cloudflareCountry !== 'XX') {
            return [
                'country_code' => $cloudflareCountry,
                'country' => $cloudflareCountry,
            ];
        }

        if (! $ipAddress || ! $this->isPublicIp($ipAddress)) {
            return [];
        }

        return Cache::remember(
            'portfolio-visit-location:'.$ipAddress,
            now()->addDays(7),
            fn (): array => $this->lookupLocation($ipAddress),
        );
    }

    private function isPublicIp(string $ipAddress): bool
    {
        return (bool) filter_var(
            $ipAddress,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE,
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function lookupLocation(string $ipAddress): array
    {
        try {
            $response = Http::timeout(2)
                ->acceptJson()
                ->get("https://ipwho.is/{$ipAddress}");

            if (! $response->ok() || $response->json('success') === false) {
                return [];
            }

            return [
                'country_code' => $response->json('country_code'),
                'country' => $response->json('country'),
                'region' => $response->json('region'),
                'city' => $response->json('city'),
                'timezone' => $response->json('timezone.id'),
                'latitude' => $response->json('latitude'),
                'longitude' => $response->json('longitude'),
            ];
        } catch (Throwable) {
            return [];
        }
    }
}
