<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioExperience extends Model
{
    protected $fillable = [
        'role',
        'organization',
        'period',
        'summary',
        'bullets',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'bullets' => 'array',
        ];
    }
}
