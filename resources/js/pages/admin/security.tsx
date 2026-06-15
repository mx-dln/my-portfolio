import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Bug,
    Clock3,
    Fingerprint,
    Radar,
    ShieldAlert,
    Siren,
    UsersRound,
} from 'lucide-react';
import { AdminHero } from './portfolio-shared';

type Summary = {
    total: number;
    today: number;
    critical: number;
    high: number;
    uniqueIps: number;
};

type GroupItem = {
    label: string;
    total: number;
};

type SecurityEvent = {
    id: number;
    ip_address?: string | null;
    method: string;
    path: string;
    url?: string | null;
    query_string?: string | null;
    referrer?: string | null;
    user_agent?: string | null;
    event_type: string;
    severity: string;
    score: number;
    status_code?: number | null;
    reasons: string[];
    occurred_at?: string | null;
};

type PaginationLink = {
    url?: string | null;
    label: string;
    active: boolean;
};

type Pagination = {
    currentPage: number;
    lastPage: number;
    total: number;
    from?: number | null;
    to?: number | null;
    links: PaginationLink[];
};

type SecurityProps = {
    summary: Summary;
    topIps: GroupItem[];
    topTypes: GroupItem[];
    events: SecurityEvent[];
    pagination: Pagination;
};

const summaryCards = [
    { key: 'total', label: 'Total events', icon: Radar },
    { key: 'today', label: 'Today', icon: Clock3 },
    { key: 'critical', label: 'Critical', icon: Siren },
    { key: 'high', label: 'High risk', icon: ShieldAlert },
    { key: 'uniqueIps', label: 'Unique IPs', icon: UsersRound },
] as const;

function formatDate(value?: string | null) {
    if (!value) {
        return 'Unknown';
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function severityClass(severity: string) {
    if (severity === 'critical') {
        return 'bg-red-500 text-white';
    }

    if (severity === 'high') {
        return 'bg-orange-400 text-neutral-950';
    }

    if (severity === 'medium') {
        return 'bg-yellow-300 text-neutral-950';
    }

    return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';
}

function GroupList({
    title,
    eyebrow,
    items,
}: {
    title: string;
    eyebrow: string;
    items: GroupItem[];
}) {
    const max = Math.max(1, ...items.map((item) => item.total));

    return (
        <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
                {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                {title}
            </h2>
            <div className="mt-5 grid gap-4">
                {items.length ? (
                    items.map((item) => (
                        <div key={item.label}>
                            <div className="flex items-center justify-between gap-3 text-sm font-black">
                                <span className="truncate">{item.label}</span>
                                <span>{item.total}</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <div
                                    className="h-full rounded-full bg-red-500"
                                    style={{
                                        width: `${Math.max(8, (item.total / max) * 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="rounded-2xl bg-neutral-50 p-4 text-sm font-semibold text-neutral-500 dark:bg-neutral-950">
                        No security events yet.
                    </p>
                )}
            </div>
        </section>
    );
}

export default function Security({
    summary,
    topIps,
    topTypes,
    events,
    pagination,
}: SecurityProps) {
    return (
        <>
            <Head title="Security Watch" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-7xl gap-6">
                    <AdminHero
                        eyebrow="Security watch"
                        title="Watch suspicious requests without exposing your clients."
                        body="Track common scanner paths, 404 probes, risky query strings, suspicious methods, IPs, user agents, and severity scores."
                    />

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {summaryCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.key}
                                    className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-bold text-neutral-500">
                                            {card.label}
                                        </p>
                                        <span className="grid size-9 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                                            <Icon className="size-4" />
                                        </span>
                                    </div>
                                    <p className="mt-4 text-4xl font-black tracking-[-0.06em]">
                                        {summary[card.key].toLocaleString()}
                                    </p>
                                </div>
                            );
                        })}
                    </section>

                    <section className="grid gap-4 lg:grid-cols-2">
                        <GroupList
                            eyebrow="Repeat sources"
                            title="Top IP addresses"
                            items={topIps}
                        />
                        <GroupList
                            eyebrow="Probe type"
                            title="Top event types"
                            items={topTypes}
                        />
                    </section>

                    <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-col gap-3 border-b border-neutral-200 p-5 sm:flex-row sm:items-end sm:justify-between dark:border-neutral-800">
                            <div>
                                <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
                                    Event stream
                                </p>
                                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                    Suspicious activity
                                </h2>
                            </div>
                            <p className="text-sm font-semibold text-neutral-500">
                                Showing {pagination.from ?? 0}-
                                {pagination.to ?? 0} of{' '}
                                {pagination.total.toLocaleString()} events.
                            </p>
                        </div>

                        <div className="grid divide-y divide-neutral-200 dark:divide-neutral-800">
                            {events.length ? (
                                events.map((event) => (
                                    <article
                                        key={event.id}
                                        className="grid gap-4 p-5 lg:grid-cols-[13rem_1fr]"
                                    >
                                        <div>
                                            <span
                                                className={[
                                                    'inline-flex rounded-full px-3 py-1 text-xs font-black uppercase',
                                                    severityClass(
                                                        event.severity,
                                                    ),
                                                ].join(' ')}
                                            >
                                                {event.severity} / {event.score}
                                            </span>
                                            <p className="mt-3 text-sm font-black">
                                                {event.ip_address ||
                                                    'Unknown IP'}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-neutral-500">
                                                {formatDate(event.occurred_at)}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1 text-xs font-black text-white dark:bg-white dark:text-neutral-950">
                                                    <Bug className="size-3" />
                                                    {event.event_type.replaceAll(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
                                                    {event.method}
                                                </span>
                                                {event.status_code && (
                                                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
                                                        HTTP {event.status_code}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-4 font-black break-words">
                                                {event.path}
                                            </p>
                                            {event.query_string && (
                                                <p className="mt-2 rounded-2xl bg-neutral-50 p-3 text-xs font-semibold break-words text-neutral-500 dark:bg-neutral-950">
                                                    ?{event.query_string}
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {event.reasons.map((reason) => (
                                                    <span
                                                        key={reason}
                                                        className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
                                                    >
                                                        <AlertTriangle className="size-3" />
                                                        {reason}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="mt-4 flex items-start gap-2 text-xs font-semibold break-words text-neutral-500">
                                                <Fingerprint className="mt-0.5 size-4 shrink-0" />
                                                {event.user_agent ||
                                                    'No user agent'}
                                            </p>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p className="p-10 text-center text-sm font-semibold text-neutral-500">
                                    No suspicious events recorded yet. That is
                                    the kind of quiet we like.
                                </p>
                            )}
                        </div>

                        {pagination.lastPage > 1 && (
                            <div className="flex flex-col gap-3 border-t border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
                                <p className="text-sm font-bold text-neutral-500">
                                    Page {pagination.currentPage} of{' '}
                                    {pagination.lastPage}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {pagination.links.map((link, index) =>
                                        link.url ? (
                                            <Link
                                                key={`${link.label}-${index}`}
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                                className={[
                                                    'rounded-full border px-4 py-2 text-sm font-black transition',
                                                    link.active
                                                        ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                                                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-red-500 hover:text-red-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200',
                                                ].join(' ')}
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <span
                                                key={`${link.label}-${index}`}
                                                className="rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm font-black text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-600"
                                            >
                                                {link.label}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security watch',
            href: '/admin/security',
        },
    ],
};
