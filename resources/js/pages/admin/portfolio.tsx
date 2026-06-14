import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    BriefcaseBusiness,
    FolderKanban,
    Link2,
    MessageCircle,
    Network,
    UserRound,
} from 'lucide-react';
import { AdminHero } from './portfolio-shared';

type Counts = {
    projects: number;
    featured: number;
    experiences: number;
    skillGroups: number;
    messages: number;
};

type PortfolioAdminProps = {
    counts: Counts;
};

const adminSections = [
    {
        title: 'Hero',
        href: '/admin/hero',
        icon: UserRound,
        body: 'Edit your name, role, hero tagline, summary, and availability.',
    },
    {
        title: 'Projects',
        href: '/admin/projects',
        icon: FolderKanban,
        body: 'Add, update, delete, and upload images for selected work.',
    },
    {
        title: 'Capability Map',
        href: '/admin/capability-map',
        icon: Network,
        body: 'Tune the interactive capability cards, services, and tech groups.',
    },
    {
        title: 'Experience',
        href: '/admin/experience',
        icon: BriefcaseBusiness,
        body: 'Manage roles, organizations, periods, summaries, and highlights.',
    },
    {
        title: 'Links & Contact',
        href: '/admin/contact',
        icon: Link2,
        body: 'Update email, phone, location, website, and social media links.',
    },
    {
        title: 'Inbox',
        href: '/admin/inbox',
        icon: MessageCircle,
        body: 'Read and reply to client messages from the floating chat.',
    },
];

export default function PortfolioAdmin({ counts }: PortfolioAdminProps) {
    return (
        <>
            <Head title="Portfolio Admin" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-7xl gap-6">
                    <AdminHero
                        eyebrow="Admin overview"
                        title="Edit the portfolio one page at a time."
                        body="The admin is now split into focused sections so updates are easier to find, review, and ship."
                        action={
                            <a
                                href="/"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white"
                            >
                                View site
                                <ArrowUpRight className="size-4" />
                            </a>
                        }
                    />

                    <section className="grid gap-4 md:grid-cols-5">
                        {[
                            ['Projects', counts.projects],
                            ['Featured', counts.featured],
                            ['Experience', counts.experiences],
                            ['Skill groups', counts.skillGroups],
                            ['Messages', counts.messages],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <p className="text-sm font-bold text-neutral-500">
                                    {label}
                                </p>
                                <p className="mt-2 text-4xl font-black tracking-[-0.06em]">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {adminSections.map((section) => (
                            <Link
                                key={section.title}
                                href={section.href}
                                className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <span className="grid size-12 place-items-center rounded-2xl bg-neutral-950 text-white">
                                        <section.icon className="size-5" />
                                    </span>
                                    <ArrowUpRight className="size-5 text-neutral-400 transition group-hover:text-neutral-950 dark:group-hover:text-white" />
                                </div>
                                <h2 className="mt-6 text-2xl font-black tracking-[-0.04em]">
                                    {section.title}
                                </h2>
                                <p className="mt-3 text-sm leading-6 font-semibold text-neutral-500">
                                    {section.body}
                                </p>
                            </Link>
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}

PortfolioAdmin.layout = {
    breadcrumbs: [
        {
            title: 'Admin overview',
            href: '/admin/portfolio',
        },
    ],
};
