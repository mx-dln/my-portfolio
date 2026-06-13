import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    BriefcaseBusiness,
    Globe2,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="grid gap-5">
                    <section className="rounded-3xl border border-neutral-200 bg-[#151614] p-6 text-white shadow-sm dark:border-neutral-800">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-sm font-black tracking-[0.24em] text-[#c6ff4a] uppercase">
                                    Portfolio admin
                                </p>
                                <h1 className="mt-3 max-w-3xl text-4xl leading-[0.96] font-black tracking-[-0.06em] sm:text-6xl">
                                    Manage the website clients see first.
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                                    Your Laravel React starter kit is now the
                                    protected admin panel. Use it to keep your
                                    public portfolio sharp, current, and
                                    client-ready.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/admin/portfolio"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c6ff4a] px-5 py-3 text-sm font-black text-[#151614]"
                                >
                                    Open studio
                                    <ArrowUpRight className="size-4" />
                                </Link>
                                <a
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white"
                                >
                                    View website
                                    <Globe2 className="size-4" />
                                </a>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                title: 'Dynamic content',
                                body: 'Profile, project cards, skill groups, and work history are served from the database.',
                                icon: BriefcaseBusiness,
                            },
                            {
                                title: 'Client-facing front page',
                                body: 'The public home page is custom-designed around your real project history and services.',
                                icon: Sparkles,
                            },
                            {
                                title: 'Protected admin',
                                body: 'Authentication, settings, passkeys, and two-factor support come from the React starter kit.',
                                icon: ShieldCheck,
                            },
                        ].map(({ title, body, icon: Icon }) => (
                            <article
                                key={title}
                                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <Icon className="size-6 text-[#119f92]" />
                                <h2 className="mt-5 text-xl font-black tracking-[-0.04em]">
                                    {title}
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                                    {body}
                                </p>
                            </article>
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
