<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioConversation;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioInboxController extends Controller
{
    public function __invoke(?PortfolioConversation $conversation = null): Response
    {
        $conversations = $this->conversations();

        $selectedConversation = $conversation?->load('messages')
            ?? $conversations->first();

        return Inertia::render('admin/inbox', [
            'conversations' => $conversations,
            'selectedConversation' => $selectedConversation,
        ]);
    }

    public function feed(): JsonResponse
    {
        return response()->json([
            'conversations' => $this->conversations(),
        ]);
    }

    public function messages(PortfolioConversation $conversation): JsonResponse
    {
        $beforeId = request()->integer('before_id') ?: null;

        return response()->json([
            'messages' => $this->messagesFor($conversation, $beforeId),
        ]);
    }

    private function conversations()
    {
        return PortfolioConversation::query()
            ->orderByDesc('last_message_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (PortfolioConversation $conversation): PortfolioConversation {
                $conversation->setRelation(
                    'messages',
                    $this->messagesFor($conversation),
                );

                return $conversation;
            });
    }

    private function messagesFor(PortfolioConversation $conversation, ?int $beforeId = null)
    {
        return $conversation->messages()
            ->reorder()
            ->when($beforeId, fn ($query) => $query->where('id', '<', $beforeId))
            ->latest('id')
            ->limit(10)
            ->get(['id', 'portfolio_conversation_id', 'sender', 'body', 'created_at'])
            ->sortBy('id')
            ->values();
    }
}
