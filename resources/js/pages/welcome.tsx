import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronRight,
    Code2,
    Database,
    Github,
    Globe2,
    Layers3,
    Linkedin,
    Mail,
    MapPin,
    Menu,
    Phone,
    ServerCog,
    ShieldCheck,
    Sparkles,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Metric = {
    value: string;
    label: string;
};

type Service = {
    title: string;
    body: string;
};

type PortfolioProfile = {
    name: string;
    role: string;
    tagline: string;
    summary: string;
    email: string;
    phone?: string | null;
    location?: string | null;
    website_url?: string | null;
    github_url?: string | null;
    linkedin_url?: string | null;
    availability?: string | null;
    metrics?: Metric[] | null;
    services?: Service[] | null;
};

type PortfolioProject = {
    id: number;
    title: string;
    category: string;
    year: string;
    url?: string | null;
    summary: string;
    impact?: string | null;
    stack?: string[] | null;
    status: string;
    featured: boolean;
};

type PortfolioExperience = {
    id: number;
    role: string;
    organization: string;
    period: string;
    summary?: string | null;
    bullets?: string[] | null;
};

type SkillGroup = {
    id: number;
    name: string;
    items: string[];
};

type WelcomeProps = {
    profile: PortfolioProfile;
    projects: PortfolioProject[];
    experiences: PortfolioExperience[];
    skillGroups: SkillGroup[];
};

const iconMap = [
    Code2,
    ServerCog,
    Database,
    Globe2,
    ShieldCheck,
    Sparkles,
    Layers3,
];

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

export default function Welcome({
    profile,
    projects,
    experiences,
    skillGroups,
}: WelcomeProps) {
    const { auth } = usePage().props as unknown as {
        auth: { user?: { name: string } | null };
    };
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const metrics = profile.metrics ?? [];
    const services = profile.services ?? [];
    const categories = useMemo(
        () => [
            'All',
            ...Array.from(new Set(projects.map((project) => project.category))),
        ],
        [projects],
    );
    const visibleProjects = useMemo(
        () =>
            selectedCategory === 'All'
                ? projects
                : projects.filter(
                      (project) => project.category === selectedCategory,
                  ),
        [projects, selectedCategory],
    );
    const navItems = [
        ['Work', '#work'],
        ['Stack', '#stack'],
        ['Experience', '#experience'],
        ['Contact', '#contact'],
    ];

    useEffect(() => {
        const elements = Array.from(
            document.querySelectorAll<HTMLElement>(
                '[data-reveal]:not(.is-visible)',
            ),
        );

        if (!elements.length) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            elements.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        let observer: IntersectionObserver;

        const reveal = (element: Element) => {
            element.classList.add('is-visible');
            observer.unobserve(element);
        };

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    reveal(entry.target);
                });
            },
            {
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.16,
            },
        );

        elements.forEach((element) => observer.observe(element));

        requestAnimationFrame(() => {
            elements.forEach((element) => {
                const rect = element.getBoundingClientRect();

                if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
                    reveal(element);
                }
            });
        });

        return () => observer.disconnect();
    }, [visibleProjects]);

    return (
        <>
            <Head title={`${profile.name} - ${profile.role}`} />
            <main className="min-h-screen bg-[#f8f9f6] text-[#151614] selection:bg-[#c6ff4a] selection:text-[#151614]">
                <div className="portfolio-bg-grid pointer-events-none fixed inset-0 z-0 [background-image:linear-gradient(rgba(21,22,20,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(21,22,20,0.08)_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.45]" />
                <div className="portfolio-bg-glow pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_12%,rgba(198,255,74,0.24),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(30,214,196,0.18),transparent_28%),radial-gradient(circle_at_65%_86%,rgba(255,91,91,0.12),transparent_24%)]" />

                <header
                    data-reveal="fade-down"
                    className="reveal-delay-1 fixed top-0 right-0 left-0 z-50 border-b border-[#151614]/10 bg-[#f8f9f6]/82 backdrop-blur-xl"
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                        <a href="#" className="group flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-full border border-[#151614] bg-[#151614] text-sm font-black tracking-[-0.04em] text-white shadow-[5px_5px_0_#c6ff4a] transition-transform group-hover:-translate-y-0.5">
                                MD
                            </span>
                            <span>
                                <span className="block text-sm font-black tracking-[0.18em] uppercase">
                                    Michael De Leon
                                </span>
                                <span className="block text-xs text-[#5c635b]">
                                    Full-stack systems engineer
                                </span>
                            </span>
                        </a>

                        <nav className="hidden items-center gap-1 rounded-full border border-[#151614]/10 bg-white/70 p-1 text-sm font-semibold lg:flex">
                            {navItems.map(([label, href]) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="rounded-full px-4 py-2 text-[#3d433c] transition hover:bg-[#151614] hover:text-white"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-3 lg:flex">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-full border border-[#151614]/15 bg-white px-4 py-2 text-sm font-bold text-[#151614] transition hover:border-[#151614]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="rounded-full border border-[#151614]/15 bg-white px-4 py-2 text-sm font-bold text-[#151614] transition hover:border-[#151614]"
                                >
                                    Admin login
                                </Link>
                            )}
                            <a
                                href={`mailto:${profile.email}`}
                                className="inline-flex items-center gap-2 rounded-full bg-[#151614] px-5 py-2.5 text-sm font-black text-white shadow-[5px_5px_0_#1ed6c4] transition hover:-translate-y-0.5"
                            >
                                Start a project
                                <ArrowUpRight className="size-4" />
                            </a>
                        </div>

                        <button
                            type="button"
                            aria-label="Toggle navigation"
                            onClick={() => setMenuOpen((open) => !open)}
                            className="grid size-11 place-items-center rounded-full border border-[#151614]/15 bg-white lg:hidden"
                        >
                            {menuOpen ? (
                                <X className="size-5" />
                            ) : (
                                <Menu className="size-5" />
                            )}
                        </button>
                    </div>

                    {menuOpen ? (
                        <div className="border-t border-[#151614]/10 bg-[#f8f9f6] px-5 py-4 lg:hidden">
                            <div className="grid gap-2">
                                {navItems.map(([label, href]) => (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-xl border border-[#151614]/10 bg-white px-4 py-3 font-bold"
                                    >
                                        {label}
                                    </a>
                                ))}
                                <Link
                                    href={auth.user ? '/dashboard' : '/login'}
                                    className="rounded-xl border border-[#151614]/10 bg-white px-4 py-3 font-bold"
                                >
                                    {auth.user ? 'Dashboard' : 'Admin login'}
                                </Link>
                            </div>
                        </div>
                    ) : null}
                </header>

                <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 pt-32 pb-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pt-28">
                    <div>
                        <div
                            data-reveal
                            className="reveal-delay-2 mb-7 inline-flex items-center gap-3 rounded-full border border-[#151614]/12 bg-white/80 px-4 py-2 text-sm font-bold text-[#3d433c] shadow-sm"
                        >
                            <span className="size-2.5 rounded-full bg-[#1ed6c4] shadow-[0_0_0_6px_rgba(30,214,196,0.18)]" />
                            {profile.availability}
                        </div>

                        <p
                            data-reveal
                            className="reveal-delay-3 mb-5 text-sm font-black tracking-[0.28em] text-[#5a6257] uppercase"
                        >
                            {profile.role}
                        </p>
                        <h1
                            data-reveal
                            className="reveal-delay-4 max-w-5xl text-5xl leading-[0.92] font-black tracking-[-0.06em] text-[#151614] sm:text-7xl lg:text-[6.8rem]"
                        >
                            {profile.name}
                        </h1>
                        <p
                            data-reveal
                            className="reveal-delay-5 mt-8 max-w-2xl text-xl leading-8 text-[#333933] sm:text-2xl sm:leading-10"
                        >
                            {profile.tagline}
                        </p>

                        <div
                            data-reveal
                            className="reveal-delay-6 mt-9 flex flex-col gap-3 sm:flex-row"
                        >
                            <a
                                href="#work"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c6ff4a] px-6 py-4 text-sm font-black text-[#151614] shadow-[6px_6px_0_#151614] transition hover:-translate-y-0.5"
                            >
                                View selected work
                                <ChevronRight className="size-4" />
                            </a>
                            <a
                                href="/michael-de-leon-resume.pdf"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#151614]/15 bg-white px-6 py-4 text-sm font-black text-[#151614] transition hover:border-[#151614]"
                            >
                                Resume PDF
                            </a>
                        </div>

                        <div
                            data-reveal
                            className="reveal-delay-7 mt-10 grid gap-3 sm:grid-cols-3"
                        >
                            {metrics.map((metric) => (
                                <div
                                    key={`${metric.value}-${metric.label}`}
                                    className="border-t border-[#151614]/15 pt-4"
                                >
                                    <div className="text-4xl font-black tracking-[-0.06em]">
                                        {metric.value}
                                    </div>
                                    <div className="mt-1 text-sm leading-5 font-semibold text-[#5c635b]">
                                        {metric.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        data-reveal="image"
                        className="reveal-delay-5 relative hidden overflow-visible lg:block lg:min-h-[700px]"
                    >
                        <img
                            src="/assets/image/hero.png"
                            alt="Michael De Leon in a suit holding a coffee cup"
                            className="absolute right-[40%] bottom-6 w-[min(124vw,730px)] max-w-none translate-x-1/2 object-contain lg:right-[-11rem] lg:bottom-8 lg:w-[880px] lg:translate-x-0"
                            style={{
                                WebkitMaskImage:
                                    'linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%)',
                                maskImage:
                                    'linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%)',
                            }}
                        />
                    </div>
                </section>

                <section
                    data-reveal
                    className="relative z-10 border-y border-[#151614]/10 bg-white/75"
                >
                    <div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 text-sm font-black tracking-[0.22em] text-[#5c635b] uppercase sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
                        <span>Government systems</span>
                        <span>Healthcare workflows</span>
                        <span>E-commerce platforms</span>
                        <span>AI and automation</span>
                    </div>
                </section>

                <section
                    id="work"
                    className="relative z-10 mx-auto max-w-7xl px-5 py-24 lg:px-8"
                >
                    <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr]">
                        <div
                            data-reveal
                            className="lg:sticky lg:top-28 lg:self-start"
                        >
                            <p className="text-sm font-black tracking-[0.28em] text-[#5a6257] uppercase">
                                Selected work
                            </p>
                            <h2 className="mt-4 text-4xl leading-[0.98] font-black tracking-[-0.06em] sm:text-6xl">
                                Built for messy operations, not just pretty
                                screens.
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-[#4d554c]">
                                {profile.summary}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory(category)
                                        }
                                        className={cx(
                                            'rounded-full border px-4 py-2 text-sm font-black transition',
                                            selectedCategory === category
                                                ? 'border-[#151614] bg-[#151614] text-white'
                                                : 'border-[#151614]/12 bg-white text-[#394038] hover:border-[#151614]',
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid auto-rows-max gap-5 lg:block">
                            {visibleProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    data-reveal="card"
                                    className={cx(
                                        'work-stack-card reveal-delay-2',
                                        index > 0 && 'lg:mt-6',
                                    )}
                                    style={{
                                        filter: 'none',
                                        transform: 'none',
                                        zIndex: index + 1,
                                    }}
                                >
                                    <article className="work-card-shell group rounded-[1.35rem] border border-[#151614]/10 bg-white p-5 shadow-sm transition hover:border-[#151614]/35 hover:shadow-md sm:p-7">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 text-xs font-black tracking-[0.18em] text-[#63705e] uppercase">
                                                    <span>
                                                        {project.category}
                                                    </span>
                                                    <span className="text-[#151614]/25">
                                                        /
                                                    </span>
                                                    <span>{project.year}</span>
                                                    <span className="rounded-full bg-[#edf0e9] px-2.5 py-1 tracking-normal text-[#394038]">
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                                                    {project.title}
                                                </h3>
                                            </div>
                                            {project.url ? (
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-full border border-[#151614]/15 px-4 py-2 text-sm font-black transition hover:border-[#151614] hover:bg-[#151614] hover:text-white"
                                                >
                                                    Visit
                                                    <ArrowUpRight className="size-4" />
                                                </a>
                                            ) : null}
                                        </div>

                                        <p className="work-card-summary mt-5 text-base leading-7 text-[#4d554c]">
                                            {project.summary}
                                        </p>
                                        {project.impact ? (
                                            <div className="work-card-impact mt-5 rounded-2xl bg-[#f3f5f0] p-4 text-sm leading-6 font-semibold text-[#343b32]">
                                                <span className="font-black">
                                                    Impact:
                                                </span>{' '}
                                                {project.impact}
                                            </div>
                                        ) : null}
                                        <div className="work-card-tags mt-6 flex flex-wrap gap-2">
                                            {(project.stack ?? []).map(
                                                (item) => (
                                                    <span
                                                        key={`${project.id}-${item}`}
                                                        className="rounded-full border border-[#151614]/10 bg-[#fbfcf9] px-3 py-1.5 text-xs font-bold text-[#4f574c]"
                                                    >
                                                        {item}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    id="stack"
                    data-reveal
                    className="relative z-10 bg-[#151614] px-5 py-24 text-white lg:px-8"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                            <div>
                                <p className="text-sm font-black tracking-[0.28em] text-[#1ed6c4] uppercase">
                                    Capability map
                                </p>
                                <h2 className="mt-4 text-4xl leading-[0.98] font-black tracking-[-0.06em] sm:text-6xl">
                                    Practical stack, broad enough to own the
                                    whole product.
                                </h2>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {services.map((service) => (
                                    <div
                                        key={service.title}
                                        className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-5"
                                    >
                                        <CheckCircle2 className="mb-4 size-5 text-[#c6ff4a]" />
                                        <h3 className="text-lg font-black tracking-[-0.03em]">
                                            {service.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-6 text-white/68">
                                            {service.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {skillGroups.map((group, index) => {
                                const Icon = iconMap[index % iconMap.length];

                                return (
                                    <div
                                        key={group.id}
                                        className="rounded-[1.25rem] border border-white/10 bg-[#20231f] p-5"
                                    >
                                        <Icon className="mb-5 size-6 text-[#c6ff4a]" />
                                        <h3 className="text-xl font-black tracking-[-0.04em]">
                                            {group.name}
                                        </h3>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {group.items.map((item) => (
                                                <span
                                                    key={`${group.id}-${item}`}
                                                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/78"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section
                    id="experience"
                    data-reveal
                    className="relative z-10 mx-auto max-w-7xl px-5 py-24 lg:px-8"
                >
                    <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
                        <div>
                            <p className="text-sm font-black tracking-[0.28em] text-[#5a6257] uppercase">
                                Experience
                            </p>
                            <h2 className="mt-4 text-4xl leading-[0.98] font-black tracking-[-0.06em] sm:text-6xl">
                                Public-sector discipline, product-builder speed.
                            </h2>
                        </div>
                        <div className="grid gap-4">
                            {experiences.map((experience) => (
                                <article
                                    key={experience.id}
                                    className="rounded-[1.35rem] border border-[#151614]/10 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black tracking-[-0.04em]">
                                                {experience.role}
                                            </h3>
                                            <p className="mt-1 font-bold text-[#4d554c]">
                                                {experience.organization}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-[#edf0e9] px-3 py-1.5 text-sm font-black text-[#394038]">
                                            {experience.period}
                                        </span>
                                    </div>
                                    {experience.summary ? (
                                        <p className="mt-5 leading-7 text-[#4d554c]">
                                            {experience.summary}
                                        </p>
                                    ) : null}
                                    <ul className="mt-5 grid gap-3">
                                        {(experience.bullets ?? []).map(
                                            (bullet) => (
                                                <li
                                                    key={bullet}
                                                    className="flex gap-3 text-sm leading-6 text-[#4d554c]"
                                                >
                                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#119f92]" />
                                                    <span>{bullet}</span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    id="contact"
                    data-reveal
                    className="relative z-10 px-5 pb-8 lg:px-8"
                >
                    <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#151614] bg-[#c6ff4a] p-6 shadow-[10px_10px_0_#151614] sm:p-10 lg:p-14">
                        <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
                            <div>
                                <p className="text-sm font-black tracking-[0.28em] text-[#38402c] uppercase">
                                    Let us make it real
                                </p>
                                <h2 className="mt-4 max-w-3xl text-4xl leading-[0.98] font-black tracking-[-0.06em] sm:text-6xl">
                                    Need a developer who can handle the product,
                                    the data, and the deployment?
                                </h2>
                            </div>
                            <div className="grid gap-3">
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="inline-flex items-center justify-between rounded-2xl bg-[#151614] px-5 py-4 text-left font-black text-white transition hover:-translate-y-0.5"
                                >
                                    <span className="inline-flex items-center gap-3">
                                        <Mail className="size-5" />
                                        {profile.email}
                                    </span>
                                    <ArrowUpRight className="size-5" />
                                </a>
                                {profile.phone ? (
                                    <a
                                        href={`tel:${profile.phone.replace(/\s/g, '')}`}
                                        className="inline-flex items-center gap-3 rounded-2xl border border-[#151614]/20 bg-white/55 px-5 py-4 font-black"
                                    >
                                        <Phone className="size-5" />
                                        {profile.phone}
                                    </a>
                                ) : null}
                                {profile.location ? (
                                    <div className="inline-flex items-center gap-3 rounded-2xl border border-[#151614]/20 bg-white/55 px-5 py-4 font-black">
                                        <MapPin className="size-5" />
                                        {profile.location}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3">
                            {profile.github_url ? (
                                <a
                                    href={profile.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#151614]/20 bg-white/60 px-4 py-2 text-sm font-black"
                                >
                                    <Github className="size-4" />
                                    GitHub
                                </a>
                            ) : null}
                            {profile.linkedin_url ? (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#151614]/20 bg-white/60 px-4 py-2 text-sm font-black"
                                >
                                    <Linkedin className="size-4" />
                                    LinkedIn
                                </a>
                            ) : null}
                            {profile.website_url ? (
                                <a
                                    href={profile.website_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#151614]/20 bg-white/60 px-4 py-2 text-sm font-black"
                                >
                                    <Globe2 className="size-4" />
                                    Website
                                </a>
                            ) : null}
                            <a
                                href="/michael-de-leon-resume.pdf"
                                className="inline-flex items-center gap-2 rounded-full border border-[#151614]/20 bg-white/60 px-4 py-2 text-sm font-black"
                            >
                                <BriefcaseBusiness className="size-4" />
                                Resume
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
