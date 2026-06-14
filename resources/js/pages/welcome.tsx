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
    LoaderCircle,
    Mail,
    MessageCircle,
    Send,
    MapPin,
    Menu,
    Phone,
    ServerCog,
    ShieldCheck,
    Sparkles,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

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
    logo_url?: string | null;
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

type ChatMessage = {
    id: number;
    sender: 'visitor' | 'admin';
    body: string;
    created_at?: string | null;
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

const openingChatMessage = `Let's Connect.

Thank you for taking the time to explore my portfolio. Every project showcased here represents my passion for creating innovative software solutions that solve real-world problems.

If you have a project in mind, a collaboration opportunity, or simply want to discuss technology, feel free to send me a message. I'm always open to new challenges and exciting ideas.

I look forward to hearing from you.`;

const techIconStyles = [
    { keywords: ['laravel'], label: 'Lv', bg: '#fff0ed', fg: '#ff2d20' },
    { keywords: ['react'], label: 'Re', bg: '#e8fbff', fg: '#149eca' },
    { keywords: ['flutter'], label: 'Fl', bg: '#edf6ff', fg: '#0468d7' },
    { keywords: ['php'], label: 'PHP', bg: '#eeefff', fg: '#4f5b93' },
    { keywords: ['python'], label: 'Py', bg: '#fff7df', fg: '#3776ab' },
    { keywords: ['mysql'], label: 'SQL', bg: '#eaf6ff', fg: '#00618a' },
    { keywords: ['tailwind'], label: 'Tw', bg: '#e8fffb', fg: '#0f9f9a' },
    { keywords: ['api'], label: 'API', bg: '#eef6ed', fg: '#2d6a4f' },
    {
        keywords: ['ai', 'openai', 'ollama', 'langchain'],
        label: 'AI',
        bg: '#f1edff',
        fg: '#6d28d9',
    },
    {
        keywords: ['gis', 'geo', 'map'],
        label: 'GIS',
        bg: '#ecfdf3',
        fg: '#16803c',
    },
    {
        keywords: ['iot', 'raspberry', 'kiosk'],
        label: 'IoT',
        bg: '#fff4e6',
        fg: '#c2410c',
    },
    { keywords: ['payment'], label: 'Pay', bg: '#f3f5f0', fg: '#151614' },
    { keywords: ['sms'], label: 'SMS', bg: '#fef2f2', fg: '#dc2626' },
];

function techIconFor(name: string) {
    const normalized = name.toLowerCase();
    const match = techIconStyles.find((style) =>
        style.keywords.some((keyword) => normalized.includes(keyword)),
    );

    if (match) {
        return match;
    }

    const label = name
        .split(/\s+|-/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();

    return {
        label: label || name.slice(0, 2).toUpperCase(),
        bg: '#f4f7ef',
        fg: '#151614',
    };
}

function TechIcon({ name }: { name: string }) {
    const icon = techIconFor(name);

    return (
        <span
            className="grid size-11 shrink-0 place-items-center rounded-2xl text-[0.68rem] font-black tracking-[-0.03em] shadow-[inset_0_0_0_1px_rgba(21,22,20,0.08)]"
            style={{ backgroundColor: icon.bg, color: icon.fg }}
        >
            {icon.label}
        </span>
    );
}

function getCsrfToken() {
    return (
        document
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

function formatChatTime(value?: string | null) {
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
    const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);
    const [chatOpen, setChatOpen] = useState(false);
    const [conversationUuid, setConversationUuid] = useState<string | null>(
        null,
    );
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatName, setChatName] = useState('');
    const [chatEmail, setChatEmail] = useState('');
    const [chatBody, setChatBody] = useState('');
    const [chatSending, setChatSending] = useState(false);
    const [chatError, setChatError] = useState<string | null>(null);

    const metrics = profile.metrics ?? [];
    const services = profile.services ?? [];
    const capabilityCards = useMemo(() => {
        const fallbackServices = skillGroups.map((group) => ({
            title: group.name,
            body: group.items.join(', '),
        }));
        const lanes = services.length ? services : fallbackServices;
        const labels = [
            'Product layer',
            'Field layer',
            'Automation layer',
            'Launch layer',
        ];
        const accents = ['#c6ff4a', '#1ed6c4', '#ff5b5b', '#ffffff'];

        return lanes.map((service, index) => {
            const group = skillGroups.length
                ? skillGroups[index % skillGroups.length]
                : null;

            return {
                ...service,
                accent: accents[index % accents.length],
                items: group?.items.slice(0, 8) ?? [],
                label: labels[index % labels.length],
                number: String(index + 1).padStart(2, '0'),
            };
        });
    }, [services, skillGroups]);
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
    const projectLogoStrip = useMemo(() => {
        const logoProjects = projects.filter((project) => project.logo_url);
        const stripItems = logoProjects.length
            ? logoProjects
            : projects.slice(0, 8);

        return stripItems.length ? [...stripItems, ...stripItems] : [];
    }, [projects]);
    const activeCapability = capabilityCards[activeCapabilityIndex] ?? {
        title: 'Full-stack delivery',
        body: 'Practical software delivery across web, mobile, data, automation, and deployment.',
        accent: '#c6ff4a',
        items: ['Laravel', 'React', 'Flutter', 'PHP', 'Python', 'MySQL'],
        label: 'Delivery layer',
        number: '01',
    };
    const activeTechItems = activeCapability.items.length
        ? activeCapability.items
        : Array.from(
              new Set(projects.flatMap((project) => project.stack ?? [])),
          ).slice(0, 9);
    const navItems = [
        ['Work', '#work'],
        ['Stack', '#stack'],
        ['Experience', '#experience'],
        ['Contact', '#contact'],
    ];

    async function loadChat(uuid: string) {
        const response = await fetch(`/portfolio-chat/${uuid}`, {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        });

        if (!response.ok) {
            return;
        }

        const data = (await response.json()) as {
            conversation_uuid: string;
            messages: ChatMessage[];
        };

        setConversationUuid(data.conversation_uuid);
        setChatMessages(data.messages ?? []);
    }

    async function sendChatMessage() {
        if (!chatBody.trim() || chatSending) {
            return;
        }

        setChatSending(true);
        setChatError(null);

        try {
            const response = await fetch('/portfolio-chat', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    conversation_uuid: conversationUuid,
                    visitor_name: chatName || undefined,
                    visitor_email: chatEmail || undefined,
                    body: chatBody,
                }),
            });

            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as {
                    message?: string;
                } | null;

                throw new Error(data?.message ?? 'Message could not be sent.');
            }

            const data = (await response.json()) as {
                conversation_uuid: string;
                messages: ChatMessage[];
            };

            window.localStorage.setItem(
                'portfolio-chat-conversation',
                data.conversation_uuid,
            );
            setConversationUuid(data.conversation_uuid);
            setChatMessages(data.messages ?? []);
            setChatBody('');
        } catch (error) {
            setChatError(
                error instanceof Error
                    ? error.message
                    : 'Message could not be sent.',
            );
        } finally {
            setChatSending(false);
        }
    }

    useEffect(() => {
        if (activeCapabilityIndex >= capabilityCards.length) {
            setActiveCapabilityIndex(0);
        }
    }, [activeCapabilityIndex, capabilityCards.length]);

    useEffect(() => {
        const storedUuid = window.localStorage.getItem(
            'portfolio-chat-conversation',
        );

        if (storedUuid) {
            setConversationUuid(storedUuid);
            void loadChat(storedUuid);
        }
    }, []);

    useEffect(() => {
        if (!chatOpen || !conversationUuid) {
            return;
        }

        const interval = window.setInterval(() => {
            void loadChat(conversationUuid);
        }, 12000);

        return () => window.clearInterval(interval);
    }, [chatOpen, conversationUuid]);

    useEffect(() => {
        const updatePointer = (event: PointerEvent) => {
            document.documentElement.style.setProperty(
                '--portfolio-cursor-x',
                `${event.clientX}px`,
            );
            document.documentElement.style.setProperty(
                '--portfolio-cursor-y',
                `${event.clientY}px`,
            );
        };

        window.addEventListener('pointermove', updatePointer, {
            passive: true,
        });

        return () => window.removeEventListener('pointermove', updatePointer);
    }, []);

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
                <div className="portfolio-cursor-glow pointer-events-none fixed inset-0 z-[1]" />

                <header
                    data-reveal="fade-down"
                    className="reveal-delay-1 fixed top-0 right-0 left-0 z-50 border-b border-[#151614]/10 bg-[#f8f9f6]/82 backdrop-blur-xl"
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                        <a href="#" className="group flex items-center gap-3">
                            <span className="grid size-11 place-items-center overflow-hidden rounded-full border border-[#151614] bg-white shadow-[5px_5px_0_#c6ff4a] transition-transform group-hover:-translate-y-0.5">
                                <AppLogoIcon className="h-full w-full object-contain p-1.5" />
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
                            ) : null}
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
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-xl border border-[#151614]/10 bg-white px-4 py-3 font-bold"
                                    >
                                        Dashboard
                                    </Link>
                                ) : null}
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
                    className="project-logo-strip relative z-10 overflow-hidden border-y border-[#151614]/10 bg-white/75"
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#f8f9f6] to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#f8f9f6] to-transparent" />
                    <div className="project-logo-track flex w-max gap-4 px-5 py-5 lg:px-8">
                        {projectLogoStrip.map((project, index) => (
                            <div
                                key={`${project.id}-${index}`}
                                className="flex min-w-52 items-center gap-3 rounded-2xl border border-[#151614]/10 bg-white/80 px-4 py-3 shadow-sm"
                            >
                                <span className="grid size-12 place-items-center overflow-hidden rounded-xl border border-[#151614]/10 bg-[#f4f7ef]">
                                    {project.logo_url ? (
                                        <img
                                            src={project.logo_url}
                                            alt={`${project.title} logo`}
                                            className="h-full w-full object-contain p-2"
                                        />
                                    ) : (
                                        <span className="text-xs font-black tracking-[-0.03em]">
                                            {project.title.slice(0, 2)}
                                        </span>
                                    )}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-black">
                                        {project.title}
                                    </span>
                                    <span className="block truncate text-xs font-bold text-[#5c635b]">
                                        {project.category}
                                    </span>
                                </span>
                            </div>
                        ))}
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
                    className="relative z-10 overflow-hidden bg-[#151614] px-5 py-24 text-white lg:px-8"
                >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(198,255,74,0.18),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(30,214,196,0.22),transparent_28%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:auto,auto,64px_64px,64px_64px]" />
                    <div className="relative mx-auto max-w-7xl">
                        <div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                            <div data-reveal>
                                <p className="text-sm font-black tracking-[0.28em] text-[#1ed6c4] uppercase">
                                    Capability map
                                </p>
                                <h2 className="mt-4 text-4xl leading-[0.98] font-black tracking-[-0.06em] sm:text-6xl">
                                    Pick a capability. Watch the tools connect.
                                </h2>
                            </div>
                            <p className="text-lg leading-8 text-white/68">
                                A compact systems map of how I move from product
                                idea to interface, data, automation, deployment,
                                and support. Tap or hover each lane to reshape
                                the map.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
                            <div className="grid gap-3">
                                {capabilityCards.map((capability, index) => {
                                    const Icon =
                                        iconMap[index % iconMap.length];
                                    const active =
                                        index === activeCapabilityIndex;

                                    return (
                                        <button
                                            key={`${capability.title}-${index}`}
                                            type="button"
                                            onClick={() =>
                                                setActiveCapabilityIndex(index)
                                            }
                                            onFocus={() =>
                                                setActiveCapabilityIndex(index)
                                            }
                                            onMouseEnter={() =>
                                                setActiveCapabilityIndex(index)
                                            }
                                            className={cx(
                                                'group rounded-[1.35rem] border p-5 text-left transition duration-300',
                                                active
                                                    ? 'border-[#c6ff4a] bg-white text-[#151614] shadow-[8px_8px_0_#1ed6c4]'
                                                    : 'border-white/10 bg-white/[0.06] text-white hover:border-white/35 hover:bg-white/[0.1]',
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className="grid size-12 place-items-center rounded-2xl border border-current/10"
                                                        style={{
                                                            backgroundColor:
                                                                active
                                                                    ? capability.accent
                                                                    : 'rgba(255,255,255,0.07)',
                                                        }}
                                                    >
                                                        <Icon className="size-5" />
                                                    </span>
                                                    <div>
                                                        <p className="text-xs font-black tracking-[0.22em] uppercase opacity-60">
                                                            {capability.label}
                                                        </p>
                                                        <h3 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                                            {capability.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-black opacity-50">
                                                    {capability.number}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="capability-map-panel relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.07] p-5 shadow-[12px_12px_0_rgba(198,255,74,0.2)] backdrop-blur sm:p-8">
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-75"
                                    style={{
                                        background: `radial-gradient(circle at 52% 45%, ${activeCapability.accent}33, transparent 34%), radial-gradient(circle at 82% 18%, rgba(30,214,196,0.22), transparent 28%)`,
                                    }}
                                />
                                <div className="relative grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                                    <div className="rounded-[1.5rem] border border-white/12 bg-[#10110f]/82 p-6">
                                        <p className="text-xs font-black tracking-[0.25em] text-white/45 uppercase">
                                            Active lane
                                        </p>
                                        <h3 className="mt-4 text-4xl leading-none font-black tracking-[-0.06em]">
                                            {activeCapability.title}
                                        </h3>
                                        <p className="mt-5 text-base leading-7 text-white/68">
                                            {activeCapability.body}
                                        </p>
                                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 font-semibold text-white/72">
                                            Built for delivery that survives
                                            real users, real data, and changing
                                            requirements.
                                        </div>
                                    </div>

                                    <div className="relative min-h-96 rounded-[1.5rem] border border-white/12 bg-[#f8f9f6] p-4 text-[#151614]">
                                        <div className="absolute inset-4 rounded-[1.25rem] border border-dashed border-[#151614]/12" />
                                        <div className="relative grid h-full gap-3 sm:grid-cols-2">
                                            {activeTechItems.map(
                                                (item, index) => (
                                                    <div
                                                        key={`${activeCapability.title}-${item}`}
                                                        className="capability-tech-node flex items-center gap-3 rounded-2xl border border-[#151614]/10 bg-white/86 p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#151614]/30 hover:shadow-md"
                                                        style={{
                                                            transitionDelay: `${index * 35}ms`,
                                                        }}
                                                    >
                                                        <TechIcon name={item} />
                                                        <span className="min-w-0">
                                                            <span className="block truncate text-sm font-black">
                                                                {item}
                                                            </span>
                                                            <span className="block text-xs font-bold text-[#5c635b]">
                                                                Connected tool
                                                            </span>
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
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

                {chatOpen ? (
                    <aside className="fixed bottom-24 left-4 z-[60] w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[1.5rem] border border-[#151614] bg-[#f8f9f6] shadow-[10px_10px_0_#151614]">
                        <div className="flex items-center justify-between border-b border-[#151614]/10 bg-white px-5 py-4">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center overflow-hidden rounded-full border border-[#151614] bg-white shadow-[4px_4px_0_#c6ff4a]">
                                    <AppLogoIcon className="h-full w-full object-contain p-1.5" />
                                </span>
                                <div>
                                    <p className="text-sm font-black">
                                        Chat with Michael
                                    </p>
                                    <p className="text-xs font-semibold text-[#5c635b]">
                                        I usually reply from the admin panel.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setChatOpen(false)}
                                className="grid size-9 place-items-center rounded-full border border-[#151614]/10 bg-white"
                                aria-label="Close chat"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="max-h-[24rem] space-y-3 overflow-y-auto px-5 py-4">
                            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[#151614] px-4 py-3 text-sm leading-6 text-white">
                                {openingChatMessage
                                    .split('\n\n')
                                    .map((paragraph) => (
                                        <p
                                            key={paragraph}
                                            className="mb-3 last:mb-0"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                            </div>

                            {chatMessages.map((message) => {
                                const fromVisitor =
                                    message.sender === 'visitor';

                                return (
                                    <div
                                        key={message.id}
                                        className={cx(
                                            'flex',
                                            fromVisitor
                                                ? 'justify-end'
                                                : 'justify-start',
                                        )}
                                    >
                                        <div
                                            className={cx(
                                                'max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6',
                                                fromVisitor
                                                    ? 'rounded-tr-sm bg-[#c6ff4a] text-[#151614]'
                                                    : 'rounded-tl-sm bg-white text-[#151614] shadow-sm',
                                            )}
                                        >
                                            <p className="whitespace-pre-wrap">
                                                {message.body}
                                            </p>
                                            <p className="mt-2 text-[0.68rem] font-bold opacity-55">
                                                {fromVisitor
                                                    ? 'You'
                                                    : 'Michael'}
                                                {formatChatTime(
                                                    message.created_at,
                                                )
                                                    ? ` - ${formatChatTime(message.created_at)}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-[#151614]/10 bg-white px-5 py-4">
                            {!conversationUuid ? (
                                <div className="mb-3 grid gap-2 sm:grid-cols-2">
                                    <input
                                        value={chatName}
                                        onChange={(event) =>
                                            setChatName(event.target.value)
                                        }
                                        placeholder="Name"
                                        className="rounded-xl border border-[#151614]/12 bg-[#f8f9f6] px-3 py-2 text-sm font-semibold outline-none focus:border-[#151614]"
                                    />
                                    <input
                                        type="email"
                                        value={chatEmail}
                                        onChange={(event) =>
                                            setChatEmail(event.target.value)
                                        }
                                        placeholder="Email"
                                        className="rounded-xl border border-[#151614]/12 bg-[#f8f9f6] px-3 py-2 text-sm font-semibold outline-none focus:border-[#151614]"
                                    />
                                </div>
                            ) : null}
                            <textarea
                                value={chatBody}
                                onChange={(event) =>
                                    setChatBody(event.target.value)
                                }
                                rows={3}
                                placeholder="Tell me about your project or question..."
                                className="w-full resize-none rounded-2xl border border-[#151614]/12 bg-[#f8f9f6] px-4 py-3 text-sm font-semibold outline-none focus:border-[#151614]"
                            />
                            {chatError ? (
                                <p className="mt-2 text-xs font-bold text-red-600">
                                    {chatError}
                                </p>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => void sendChatMessage()}
                                disabled={chatSending || !chatBody.trim()}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#151614] px-5 py-3 text-sm font-black text-white shadow-[5px_5px_0_#1ed6c4] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {chatSending ? (
                                    <LoaderCircle className="size-4 animate-spin" />
                                ) : (
                                    <Send className="size-4" />
                                )}
                                Send message
                            </button>
                        </div>
                    </aside>
                ) : null}

                <button
                    type="button"
                    onClick={() => setChatOpen((open) => !open)}
                    className="fixed bottom-5 left-4 z-[60] inline-flex items-center gap-3 rounded-full bg-[#151614] px-5 py-3 text-sm font-black text-white shadow-[6px_6px_0_#c6ff4a] transition hover:-translate-y-0.5"
                >
                    <MessageCircle className="size-5" />
                    Chat with me
                </button>
            </main>
        </>
    );
}
