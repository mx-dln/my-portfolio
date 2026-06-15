<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioVisit extends Model
{
    protected $fillable = [
        'visitor_uuid',
        'ip_address',
        'url',
        'referrer',
        'device_type',
        'device_name',
        'platform',
        'browser',
        'country_code',
        'country',
        'region',
        'city',
        'timezone',
        'latitude',
        'longitude',
        'is_bot',
        'user_agent',
        'visited_at',
    ];

    protected function casts(): array
    {
        return [
            'is_bot' => 'boolean',
            'latitude' => 'float',
            'longitude' => 'float',
            'visited_at' => 'datetime',
        ];
    }
}
