import { Head } from '@inertiajs/react';
import {
    Bot,
    Clock3,
    Eye,
    Globe2,
    Laptop,
    MapPin,
    MousePointerClick,
    Smartphone,
    UsersRound,
} from 'lucide-react';
import { AdminHero } from './portfolio-shared';

type Summary = {
    totalVisits: number;
    uniqueVisitors: number;
    todayVisits: number;
    weekVisits: number;
    countries: number;
    bots: number;
};

type GroupItem = {
    label: string;
    total: number;
};

type RecentVisit = {
    id: number;
    ip_address?: string | null;
    device_type?: string | null;
    device_name?: string | null;
    platform?: string | null;
    browser?: string | null;
    country?: string | null;
    country_code?: string | null;
    region?: string | null;
    city?: string | null;
    location: string;
    referrer?: string | null;
    url?: string | null;
    is_bot: boolean;
    user_agent?: string | null;
    visited_at?: string | null;
};

type VisitorsProps = {
    summary: Summary;
    timeline: GroupItem[];
    topCountries: GroupItem[];
    topCities: GroupItem[];
    devices: GroupItem[];
    browsers: GroupItem[];
    recentVisits: RecentVisit[];
};

const summaryCards = [
    { key: 'totalVisits', label: 'Total visits', icon: Eye },
    { key: 'uniqueVisitors', label: 'Unique visitors', icon: UsersRound },
    { key: 'todayVisits', label: 'Today', icon: MousePointerClick },
    { key: 'weekVisits', label: 'Last 7 days', icon: Clock3 },
    { key: 'countries', label: 'Countries', icon: Globe2 },
    { key: 'bots', label: 'Bots', icon: Bot },
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

function maxTotal(items: GroupItem[]) {
    return Math.max(1, ...items.map((item) => item.total));
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
    const max = maxTotal(items);

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
                                    className="h-full rounded-full bg-[#c6ff4a]"
                                    style={{
                                        width: `${Math.max(8, (item.total / max) * 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="rounded-2xl bg-neutral-50 p-4 text-sm font-semibold text-neutral-500 dark:bg-neutral-950">
                        No data yet.
                    </p>
                )}
            </div>
        </section>
    );
}

function Timeline({ items }: { items: GroupItem[] }) {
    const max = maxTotal(items);

    return (
        <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
                        Visit rhythm
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                        Last 14 days
                    </h2>
                </div>
                <p className="text-sm font-semibold text-neutral-500">
                    Counts every public homepage load.
                </p>
            </div>

            <div className="mt-8 flex h-56 items-end gap-2 overflow-x-auto pb-2">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="flex min-w-12 flex-1 flex-col items-center gap-2"
                    >
                        <div className="flex h-40 w-full items-end rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
                            <div
                                className="w-full rounded-full bg-[#c6ff4a]"
                                style={{
                                    height: `${Math.max(5, (item.total / max) * 100)}%`,
                                }}
                            />
                        </div>
                        <span className="text-xs font-bold text-neutral-500">
                            {item.label}
                        </span>
                        <span className="text-xs font-black">{item.total}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function Visitors({
    summary,
    timeline,
    topCountries,
    topCities,
    devices,
    browsers,
    recentVisits,
}: VisitorsProps) {
    return (
        <>
            <Head title="Visitor Analytics" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-7xl gap-6">
                    <AdminHero
                        eyebrow="Visitor analytics"
                        title="See who is landing on your portfolio."
                        body="Track visits, IPs, device type, browser, country, city, referrer, and bots from one private admin screen."
                    />

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                        <Timeline items={timeline} />
                        <GroupList
                            eyebrow="Geography"
                            title="Top countries"
                            items={topCountries}
                        />
                        <GroupList
                            eyebrow="Places"
                            title="Top cities"
                            items={topCities}
                        />
                        <GroupList
                            eyebrow="Devices"
                            title="Device types"
                            items={devices}
                        />
                        <GroupList
                            eyebrow="Browsers"
                            title="Browsers"
                            items={browsers}
                        />
                    </section>

                    <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-col gap-3 border-b border-neutral-200 p-5 sm:flex-row sm:items-end sm:justify-between dark:border-neutral-800">
                            <div>
                                <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
                                    Live log
                                </p>
                                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                    Recent visitors
                                </h2>
                            </div>
                            <p className="text-sm font-semibold text-neutral-500">
                                Showing latest {recentVisits.length} visits.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-[980px] divide-y divide-neutral-200 text-left text-sm dark:divide-neutral-800">
                                <thead className="bg-neutral-50 text-xs font-black tracking-[0.18em] text-neutral-500 uppercase dark:bg-neutral-950">
                                    <tr>
                                        <th className="px-5 py-4">Visitor</th>
                                        <th className="px-5 py-4">Device</th>
                                        <th className="px-5 py-4">Place</th>
                                        <th className="px-5 py-4">Referrer</th>
                                        <th className="px-5 py-4">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {recentVisits.length ? (
                                        recentVisits.map((visit) => (
                                            <tr
                                                key={visit.id}
                                                className="align-top"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                                                            {visit.is_bot ? (
                                                                <Bot className="size-4" />
                                                            ) : (
                                                                <MousePointerClick className="size-4" />
                                                            )}
                                                        </span>
                                                        <div>
                                                            <p className="font-black">
                                                                {visit.ip_address ||
                                                                    'Unknown IP'}
                                                            </p>
                                                            <p className="mt-1 max-w-xs truncate text-xs font-semibold text-neutral-500">
                                                                {visit.user_agent ||
                                                                    'No user agent'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-2">
                                                        {visit.device_type ===
                                                        'Mobile' ? (
                                                            <Smartphone className="mt-0.5 size-4 shrink-0 text-[#119f92]" />
                                                        ) : (
                                                            <Laptop className="mt-0.5 size-4 shrink-0 text-[#119f92]" />
                                                        )}
                                                        <div>
                                                            <p className="font-black">
                                                                {visit.device_type ||
                                                                    'Unknown'}
                                                            </p>
                                                            <p className="mt-1 text-xs font-semibold text-neutral-500">
                                                                {[
                                                                    visit.device_name,
                                                                    visit.platform,
                                                                    visit.browser,
                                                                ]
                                                                    .filter(
                                                                        Boolean,
                                                                    )
                                                                    .join(
                                                                        ' / ',
                                                                    ) ||
                                                                    'No device details'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="mt-0.5 size-4 shrink-0 text-[#119f92]" />
                                                        <div>
                                                            <p className="font-black">
                                                                {visit.location}
                                                            </p>
                                                            <p className="mt-1 text-xs font-semibold text-neutral-500">
                                                                {visit.country_code ||
                                                                    'No country code'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="max-w-xs font-semibold break-words text-neutral-600 dark:text-neutral-300">
                                                        {visit.referrer ||
                                                            'Direct visit'}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="font-black">
                                                        {formatDate(
                                                            visit.visited_at,
                                                        )}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-5 py-12 text-center text-sm font-semibold text-neutral-500"
                                            >
                                                No visits recorded yet. Open the
                                                public homepage once and this
                                                page will start filling in.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

Visitors.layout = {
    breadcrumbs: [
        {
            title: 'Visitor analytics',
            href: '/admin/visitors',
        },
    ],
};
