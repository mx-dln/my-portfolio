<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProfile extends Model
{
    protected $fillable = [
        'name',
        'role',
        'tagline',
        'summary',
        'email',
        'phone',
        'location',
        'website_url',
        'github_url',
        'linkedin_url',
        'availability',
        'metrics',
        'services',
    ];

    protected function casts(): array
    {
        return [
            'metrics' => 'array',
            'services' => 'array',
        ];
    }
}
