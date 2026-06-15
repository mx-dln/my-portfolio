<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePortfolioAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $adminEmail = (string) config('app.admin_email');

        if (! $request->user() || ! hash_equals($adminEmail, (string) $request->user()->email)) {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            abort(403);
        }

        return $next($request);
    }
}
