<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_conversation_id',
        'sender',
        'body',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(PortfolioConversation::class, 'portfolio_conversation_id');
    }
}
