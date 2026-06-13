<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PortfolioProject extends Model
{
    protected $fillable = [
        'title',
        'category',
        'year',
        'url',
        'logo_path',
        'summary',
        'impact',
        'stack',
        'status',
        'featured',
        'sort_order',
    ];

    protected $appends = [
        'logo_url',
    ];

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
            'stack' => 'array',
        ];
    }

    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo_path) {
            return null;
        }

        return Storage::disk('public')->url($this->logo_path);
    }
}
