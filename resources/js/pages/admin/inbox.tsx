import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    LoaderCircle,
    Mail,
    MessageCircle,
    Send,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';

type PortfolioChatMessage = {
    id: number;
    sender: 'visitor' | 'admin';
    body: string;
    created_at?: string | null;
};

type PortfolioConversation = {
    id: number;
    uuid: string;
    visitor_name?: string | null;
    visitor_email?: string | null;
    last_message_at?: string | null;
    created_at?: string | null;
    messages: PortfolioChatMessage[];
};

type InboxProps = {
    conversations: PortfolioConversation[];
    selectedConversation?: PortfolioConversation | null;
};

const chatSoundUrl = '/assets/sound/chat-sound.mp3';

function formatInboxDate(value?: string | null) {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

function conversationTimestamp(conversation: PortfolioConversation) {
    return new Date(
        conversation.last_message_at ?? conversation.created_at ?? '',
    ).getTime();
}

function sortConversations(conversations: PortfolioConversation[]) {
    return [...conversations].sort(
        (a, b) => conversationTimestamp(b) - conversationTimestamp(a),
    );
}

function mergeMessages(
    currentMessages: PortfolioChatMessage[],
    nextMessages: PortfolioChatMessage[],
) {
    return [...currentMessages, ...nextMessages]
        .filter(
            (message, index, messages) =>
                messages.findIndex((item) => item.id === message.id) === index,
        )
        .sort((a, b) => a.id - b.id);
}

function getCsrfToken() {
    return (
        document
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

function FieldError({ error }: { error?: string | null }) {
    if (!error) {
        return null;
    }

    return <p className="text-sm font-semibold text-red-600">{error}</p>;
}

function ReplyComposer({
    conversation,
    onReplied,
}: {
    conversation: PortfolioConversation;
    onReplied: (conversation: PortfolioConversation) => void;
}) {
    const [body, setBody] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (!body.trim() || processing) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const response = await fetch(
                `/admin/portfolio/conversations/${conversation.id}/reply`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({ body }),
                },
            );

            const data = (await response.json().catch(() => null)) as {
                conversation?: PortfolioConversation;
                errors?: { body?: string[] };
                message?: string;
            } | null;

            if (!response.ok) {
                throw new Error(
                    data?.errors?.body?.[0] ??
                        data?.message ??
                        'Reply could not be sent.',
                );
            }

            if (data?.conversation) {
                onReplied(data.conversation);
            }

            setBody('');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Reply could not be sent.',
            );
        } finally {
            setProcessing(false);
        }
    }

    return (
        <form
            onSubmit={submit}
            className="border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
        >
            <div className="grid gap-3">
                <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={3}
                    placeholder="Write a reply..."
                    className="w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold transition outline-none focus:border-neutral-950 focus:ring-4 focus:ring-lime-300/40 dark:border-neutral-800 dark:bg-neutral-900"
                />
                <FieldError error={error} />
                <button
                    type="submit"
                    disabled={processing || !body.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60 dark:bg-lime-300 dark:text-neutral-950"
                >
                    {processing ? (
                        <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                        <Send className="size-4" />
                    )}
                    Send reply
                </button>
            </div>
        </form>
    );
}

export default function Inbox({
    conversations,
    selectedConversation,
}: InboxProps) {
    const [inboxConversations, setInboxConversations] = useState(() =>
        sortConversations(conversations),
    );
    const [activeConversationId, setActiveConversationId] = useState<
        number | null
    >(selectedConversation?.id ?? conversations[0]?.id ?? null);
    const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>(
        {},
    );
    const [hasOlderMessages, setHasOlderMessages] = useState<
        Record<number, boolean>
    >(() =>
        Object.fromEntries(
            conversations.map((conversation) => [
                conversation.id,
                conversation.messages.length === 10,
            ]),
        ),
    );
    const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
    const messageIdsRef = useRef<Set<number>>(
        new Set(
            conversations.flatMap((conversation) =>
                conversation.messages.map((message) => message.id),
            ),
        ),
    );
    const soundRef = useRef<HTMLAudioElement | null>(null);
    const threadRef = useRef<HTMLDivElement | null>(null);
    const shouldScrollToBottomRef = useRef(true);

    const activeConversation = useMemo(
        () =>
            inboxConversations.find(
                (conversation) => conversation.id === activeConversationId,
            ) ??
            inboxConversations[0] ??
            null,
        [activeConversationId, inboxConversations],
    );
    const totalUnread = Object.values(unreadCounts).reduce(
        (sum, count) => sum + count,
        0,
    );

    function playChatSound() {
        soundRef.current ??= new Audio(chatSoundUrl);
        soundRef.current.currentTime = 0;
        void soundRef.current.play().catch(() => undefined);
    }

    function rememberMessages(nextConversations: PortfolioConversation[]) {
        messageIdsRef.current = new Set(
            nextConversations.flatMap((conversation) =>
                conversation.messages.map((message) => message.id),
            ),
        );
    }

    function chooseConversation(conversationId: number) {
        setActiveConversationId(conversationId);
        shouldScrollToBottomRef.current = true;
        setUnreadCounts((counts) => {
            const next = { ...counts };
            delete next[conversationId];

            return next;
        });
    }

    function replaceConversation(nextConversation: PortfolioConversation) {
        shouldScrollToBottomRef.current = true;
        setInboxConversations((current) =>
            sortConversations([
                nextConversation,
                ...current.filter(
                    (conversation) => conversation.id !== nextConversation.id,
                ),
            ]),
        );
        messageIdsRef.current = new Set([
            ...messageIdsRef.current,
            ...nextConversation.messages.map((message) => message.id),
        ]);
        setHasOlderMessages((current) => ({
            ...current,
            [nextConversation.id]: nextConversation.messages.length === 10,
        }));
    }

    async function loadInbox(notify = true) {
        const response = await fetch('/admin/inbox-feed', {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        });

        if (!response.ok) {
            return;
        }

        const data = (await response.json()) as {
            conversations: PortfolioConversation[];
        };
        const latestConversations = sortConversations(data.conversations ?? []);
        const previousIds = messageIdsRef.current;
        const newVisitorCounts = new Map<number, number>();

        latestConversations.forEach((conversation) => {
            const newVisitorMessages = conversation.messages.filter(
                (message) =>
                    message.sender === 'visitor' &&
                    !previousIds.has(message.id),
            );

            if (newVisitorMessages.length > 0) {
                newVisitorCounts.set(
                    conversation.id,
                    newVisitorMessages.length,
                );
            }
        });

        if (notify && previousIds.size > 0 && newVisitorCounts.size > 0) {
            playChatSound();
            if (
                activeConversationId &&
                newVisitorCounts.has(activeConversationId)
            ) {
                shouldScrollToBottomRef.current = true;
            }
            setUnreadCounts((counts) => {
                const next = { ...counts };

                newVisitorCounts.forEach((count, conversationId) => {
                    if (conversationId !== activeConversationId) {
                        next[conversationId] =
                            (next[conversationId] ?? 0) + count;
                    }
                });

                return next;
            });
        }

        setInboxConversations((currentConversations) => {
            const mergedConversations = latestConversations.map(
                (latestConversation) => {
                    const currentConversation = currentConversations.find(
                        (conversation) =>
                            conversation.id === latestConversation.id,
                    );

                    if (!currentConversation) {
                        return latestConversation;
                    }

                    return {
                        ...latestConversation,
                        messages: mergeMessages(
                            currentConversation.messages,
                            latestConversation.messages,
                        ),
                    };
                },
            );

            rememberMessages(mergedConversations);

            return sortConversations(mergedConversations);
        });
        setHasOlderMessages((current) => ({
            ...current,
            ...Object.fromEntries(
                latestConversations.map((conversation) => [
                    conversation.id,
                    current[conversation.id] ??
                        conversation.messages.length === 10,
                ]),
            ),
        }));

        if (!activeConversationId && latestConversations[0]) {
            setActiveConversationId(latestConversations[0].id);
        }
    }

    async function loadOlderMessages() {
        if (
            !activeConversation ||
            !activeConversation.messages.length ||
            loadingOlderMessages
        ) {
            return;
        }

        setLoadingOlderMessages(true);
        shouldScrollToBottomRef.current = false;

        try {
            const response = await fetch(
                `/admin/inbox-messages/${activeConversation.id}?before_id=${activeConversation.messages[0].id}`,
                {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                },
            );

            if (!response.ok) {
                return;
            }

            const data = (await response.json()) as {
                messages: PortfolioChatMessage[];
            };

            messageIdsRef.current = new Set([
                ...messageIdsRef.current,
                ...(data.messages ?? []).map((message) => message.id),
            ]);
            setInboxConversations((current) =>
                current.map((conversation) =>
                    conversation.id === activeConversation.id
                        ? {
                              ...conversation,
                              messages: mergeMessages(
                                  data.messages ?? [],
                                  conversation.messages,
                              ),
                          }
                        : conversation,
                ),
            );
            setHasOlderMessages((current) => ({
                ...current,
                [activeConversation.id]: (data.messages ?? []).length === 10,
            }));
        } finally {
            setLoadingOlderMessages(false);
        }
    }

    useEffect(() => {
        const interval = window.setInterval(() => {
            void loadInbox();
        }, 5000);

        return () => window.clearInterval(interval);
    }, [activeConversationId]);

    useEffect(() => {
        if (!shouldScrollToBottomRef.current) {
            return;
        }

        window.requestAnimationFrame(() => {
            if (threadRef.current) {
                threadRef.current.scrollTop = threadRef.current.scrollHeight;
            }
        });
    }, [activeConversationId, activeConversation?.messages.length]);

    return (
        <>
            <Head title="Portfolio Inbox" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-7xl gap-5">
                    <section className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-[#151614] p-6 text-white shadow-sm sm:flex-row sm:items-end sm:justify-between dark:border-neutral-800">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-sm font-black tracking-[0.24em] text-[#c6ff4a] uppercase">
                                    Messenger inbox
                                </p>
                                {totalUnread > 0 ? (
                                    <span className="rounded-full bg-[#ff5b5b] px-3 py-1 text-xs font-black text-white">
                                        {totalUnread} new message
                                        {totalUnread === 1 ? '' : 's'}
                                    </span>
                                ) : null}
                            </div>
                            <h1 className="mt-3 text-4xl leading-[0.96] font-black tracking-[-0.06em] sm:text-6xl">
                                Client conversations.
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                                Read messages from the public chat widget and
                                reply without leaving the admin panel.
                            </p>
                        </div>
                        <Link
                            href="/admin/portfolio"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white"
                        >
                            <ArrowLeft className="size-4" />
                            Studio
                        </Link>
                    </section>

                    <section className="grid min-h-[36rem] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm lg:grid-cols-[22rem_1fr] dark:border-neutral-800 dark:bg-neutral-950">
                        <aside className="border-b border-neutral-200 bg-neutral-50 lg:border-r lg:border-b-0 dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
                                <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
                                    Conversations
                                </p>
                                <p className="mt-1 text-2xl font-black tracking-[-0.04em]">
                                    {inboxConversations.length} total
                                </p>
                            </div>
                            <div className="max-h-[36rem] overflow-y-auto p-2">
                                {inboxConversations.length ? (
                                    inboxConversations.map((conversation) => {
                                        const latestMessage =
                                            conversation.messages[
                                                conversation.messages.length - 1
                                            ];
                                        const active =
                                            activeConversation?.id ===
                                            conversation.id;
                                        const unread =
                                            unreadCounts[conversation.id] ?? 0;

                                        return (
                                            <button
                                                type="button"
                                                key={conversation.id}
                                                onClick={() =>
                                                    chooseConversation(
                                                        conversation.id,
                                                    )
                                                }
                                                className={[
                                                    'block w-full rounded-2xl border p-4 text-left transition',
                                                    active
                                                        ? 'border-neutral-950 bg-white shadow-sm dark:border-lime-300 dark:bg-neutral-950'
                                                        : 'border-transparent hover:border-neutral-200 hover:bg-white dark:hover:border-neutral-800 dark:hover:bg-neutral-950',
                                                ].join(' ')}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate font-black">
                                                                {conversation.visitor_name ||
                                                                    'Portfolio visitor'}
                                                            </p>
                                                            {unread > 0 ? (
                                                                <span className="shrink-0 rounded-full bg-[#ff5b5b] px-2 py-0.5 text-[0.62rem] font-black text-white">
                                                                    {unread}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                        <p className="mt-1 truncate text-xs font-semibold text-neutral-500">
                                                            {conversation.visitor_email ||
                                                                'No email provided'}
                                                        </p>
                                                    </div>
                                                    <span className="text-[0.68rem] font-black text-neutral-400">
                                                        {formatInboxDate(
                                                            conversation.last_message_at ??
                                                                conversation.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                                                    {latestMessage?.body ??
                                                        'No messages yet.'}
                                                </p>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-800">
                                        <MessageCircle className="mx-auto size-8 text-neutral-400" />
                                        <p className="mt-3 text-sm font-bold text-neutral-500">
                                            No client chats yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </aside>

                        <div className="flex min-h-[36rem] flex-col">
                            {activeConversation ? (
                                <>
                                    <header className="flex flex-col gap-3 border-b border-neutral-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-950">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-[-0.04em]">
                                                {activeConversation.visitor_name ||
                                                    'Portfolio visitor'}
                                            </h2>
                                            <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500">
                                                <Mail className="size-4" />
                                                {activeConversation.visitor_email ||
                                                    'No email provided'}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-black text-neutral-500 dark:bg-neutral-900">
                                            {formatInboxDate(
                                                activeConversation.last_message_at ??
                                                    activeConversation.created_at,
                                            )}
                                        </span>
                                    </header>

                                    <div
                                        ref={threadRef}
                                        className="flex-1 space-y-4 overflow-y-auto bg-neutral-50 p-5 dark:bg-neutral-900"
                                    >
                                        {hasOlderMessages[
                                            activeConversation.id
                                        ] ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void loadOlderMessages()
                                                }
                                                disabled={loadingOlderMessages}
                                                className="mx-auto flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-black text-neutral-600 shadow-sm disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950"
                                            >
                                                {loadingOlderMessages
                                                    ? 'Loading...'
                                                    : 'Load older messages'}
                                            </button>
                                        ) : null}

                                        {activeConversation.messages.map(
                                            (message) => {
                                                const visitor =
                                                    message.sender ===
                                                    'visitor';

                                                return (
                                                    <div
                                                        key={message.id}
                                                        className={[
                                                            'flex',
                                                            visitor
                                                                ? 'justify-start'
                                                                : 'justify-end',
                                                        ].join(' ')}
                                                    >
                                                        <div
                                                            className={[
                                                                'max-w-[82%] rounded-3xl px-5 py-4 text-sm leading-6 shadow-sm',
                                                                visitor
                                                                    ? 'rounded-tl-sm bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100'
                                                                    : 'rounded-tr-sm bg-lime-300 text-neutral-950',
                                                            ].join(' ')}
                                                        >
                                                            <p className="whitespace-pre-wrap">
                                                                {message.body}
                                                            </p>
                                                            <p className="mt-3 text-[0.68rem] font-black opacity-50">
                                                                {visitor
                                                                    ? 'Visitor'
                                                                    : 'You'}{' '}
                                                                -{' '}
                                                                {formatInboxDate(
                                                                    message.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>

                                    <ReplyComposer
                                        conversation={activeConversation}
                                        onReplied={replaceConversation}
                                    />
                                </>
                            ) : (
                                <div className="grid flex-1 place-items-center p-8 text-center">
                                    <div>
                                        <MessageCircle className="mx-auto size-12 text-neutral-400" />
                                        <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                                            No conversation selected
                                        </h2>
                                        <p className="mt-2 text-sm font-semibold text-neutral-500">
                                            New messages from the public website
                                            will appear here.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

Inbox.layout = {
    breadcrumbs: [
        {
            title: 'Inbox',
            href: '/admin/inbox',
        },
    ],
};
