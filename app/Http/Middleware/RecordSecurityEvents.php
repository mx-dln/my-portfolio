<?php

namespace App\Http\Middleware;

use App\Services\SecurityWatcher;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RecordSecurityEvents
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        app(SecurityWatcher::class)->record($request, $response->getStatusCode());

        return $response;
    }
}
