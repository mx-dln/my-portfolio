<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecurityEvent extends Model
{
    protected $fillable = [
        'ip_address',
        'method',
        'path',
        'url',
        'query_string',
        'referrer',
        'user_agent',
        'event_type',
        'severity',
        'score',
        'status_code',
        'reasons',
        'occurred_at',
    ];

    protected function casts(): array
    {
        return [
            'reasons' => 'array',
            'occurred_at' => 'datetime',
        ];
    }
}
