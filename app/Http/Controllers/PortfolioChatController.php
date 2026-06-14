<?php

namespace App\Http\Controllers;

use App\Models\PortfolioConversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PortfolioChatController extends Controller
{
    public function show(PortfolioConversation $conversation): JsonResponse
    {
        return response()->json([
            'conversation_uuid' => $conversation->uuid,
            'messages' => $conversation->messages()->get(['id', 'sender', 'body', 'created_at']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'conversation_uuid' => ['nullable', 'uuid', Rule::exists('portfolio_conversations', 'uuid')],
            'visitor_name' => ['nullable', 'string', 'max:120'],
            'visitor_email' => ['nullable', 'email', 'max:180'],
            'body' => ['required', 'string', 'max:3000'],
        ]);

        $conversation = isset($data['conversation_uuid'])
            ? PortfolioConversation::query()->where('uuid', $data['conversation_uuid'])->firstOrFail()
            : PortfolioConversation::query()->create([
                'visitor_name' => $data['visitor_name'] ?? null,
                'visitor_email' => $data['visitor_email'] ?? null,
            ]);

        if (! empty($data['visitor_name']) || ! empty($data['visitor_email'])) {
            $conversation->fill([
                'visitor_name' => $data['visitor_name'] ?? $conversation->visitor_name,
                'visitor_email' => $data['visitor_email'] ?? $conversation->visitor_email,
            ]);
        }

        $conversation->last_message_at = now();
        $conversation->save();

        $conversation->messages()->create([
            'sender' => 'visitor',
            'body' => $data['body'],
        ]);

        return response()->json([
            'conversation_uuid' => $conversation->uuid,
            'messages' => $conversation->messages()->get(['id', 'sender', 'body', 'created_at']),
        ], 201);
    }
}
