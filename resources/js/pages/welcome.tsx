import { Head } from '@inertiajs/react';
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
    Moon,
    Phone,
    Settings,
    ServerCog,
    ShieldCheck,
    Sparkles,
    Sun,
    X,
} from 'lucide-react';
import {
    type CSSProperties,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    siArduino,
    siDocker,
    siFacebook,
    siFlutter,
    siGit,
    siGithub,
    siInstagram,
    siJavascript,
    siLangchain,
    siLaravel,
    siLeaflet,
    siMapbox,
    siMysql,
    siNodedotjs,
    siOllama,
    siOpenstreetmap,
    siPhp,
    siPython,
    siRaspberrypi,
    siReact,
    siStripe,
    siTailwindcss,
    siTypescript,
    siVuedotjs,
    type SimpleIcon,
} from 'simple-icons';
import AppLogoIcon from '@/components/app-logo-icon';
import { useAppearance } from '@/hooks/use-appearance';

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
    facebook_url?: string | null;
    instagram_url?: string | null;
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

const chatSoundUrl = '/assets/sound/chat-sound.mp3';
const themePlaygroundStorageKey = 'portfolio-theme-playground';

type ThemePlaygroundSettings = {
    accent: string;
    secondary: string;
    background: string;
    surface: string;
    ink: string;
    cursor: 'glow' | 'spotlight' | 'orbit' | 'none';
    backgroundEffect: 'soft' | 'grid' | 'vivid';
};

const defaultThemePlaygroundSettings: ThemePlaygroundSettings = {
    accent: '#c6ff4a',
    secondary: '#1ed6c4',
    background: '#f8f9f6',
    surface: '#ffffff',
    ink: '#151614',
    cursor: 'glow',
    backgroundEffect: 'soft',
};

const themePlaygroundPresets: Array<
    ThemePlaygroundSettings & { name: string; note: string }
> = [
    {
        ...defaultThemePlaygroundSettings,
        name: 'Lime System',
        note: 'Current portfolio energy',
    },
    {
        name: 'Ocean Build',
        note: 'Cool, SaaS-like, technical',
        accent: '#38f8d7',
        secondary: '#5aa7ff',
        background: '#f4fbfb',
        surface: '#ffffff',
        ink: '#0e1b1a',
        cursor: 'spotlight',
        backgroundEffect: 'grid',
    },
    {
        name: 'Signal Violet',
        note: 'AI product mood',
        accent: '#a78bfa',
        secondary: '#22d3ee',
        background: '#fbf8ff',
        surface: '#ffffff',
        ink: '#171327',
        cursor: 'orbit',
        backgroundEffect: 'vivid',
    },
    {
        name: 'Coral Launch',
        note: 'Warm startup pop',
        accent: '#ff7a59',
        secondary: '#ffd166',
        background: '#fff8f3',
        surface: '#ffffff',
        ink: '#211513',
        cursor: 'glow',
        backgroundEffect: 'vivid',
    },
    {
        name: 'Executive Mono',
        note: 'Clean black and white',
        accent: '#ffffff',
        secondary: '#9ca3af',
        background: '#f6f6f3',
        surface: '#ffffff',
        ink: '#111111',
        cursor: 'spotlight',
        backgroundEffect: 'grid',
    },
    {
        name: 'Midnight Neon',
        note: 'Dark demo mode',
        accent: '#c6ff4a',
        secondary: '#00e5ff',
        background: '#0f110f',
        surface: '#171a17',
        ink: '#f8f9f6',
        cursor: 'orbit',
        backgroundEffect: 'vivid',
    },
];

const themeBackgroundOptions: Array<{
    value: ThemePlaygroundSettings['backgroundEffect'];
    label: string;
}> = [
    { value: 'soft', label: 'Soft' },
    { value: 'grid', label: 'Grid' },
    { value: 'vivid', label: 'Vivid' },
];

const themeCursorOptions: Array<{
    value: ThemePlaygroundSettings['cursor'];
    label: string;
}> = [
    { value: 'glow', label: 'Glow' },
    { value: 'spotlight', label: 'Spotlight' },
    { value: 'orbit', label: 'Orbit' },
    { value: 'none', label: 'Off' },
];

const themeAccentSwatches = [
    '#c6ff4a',
    '#1ed6c4',
    '#38f8d7',
    '#5aa7ff',
    '#a78bfa',
    '#f472b6',
    '#ff7a59',
    '#ffd166',
    '#ffffff',
    '#111111',
    '#16a34a',
    '#f97316',
];

function isHexColor(value: unknown): value is string {
    return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

function loadThemePlaygroundSettings(): ThemePlaygroundSettings {
    if (typeof window === 'undefined') {
        return defaultThemePlaygroundSettings;
    }

    const stored = window.localStorage.getItem(themePlaygroundStorageKey);

    if (!stored) {
        return defaultThemePlaygroundSettings;
    }

    try {
        const parsed = JSON.parse(stored) as Partial<ThemePlaygroundSettings>;

        return {
            accent: isHexColor(parsed.accent)
                ? parsed.accent
                : defaultThemePlaygroundSettings.accent,
            secondary: isHexColor(parsed.secondary)
                ? parsed.secondary
                : defaultThemePlaygroundSettings.secondary,
            background: isHexColor(parsed.background)
                ? parsed.background
                : defaultThemePlaygroundSettings.background,
            surface: isHexColor(parsed.surface)
                ? parsed.surface
                : defaultThemePlaygroundSettings.surface,
            ink: isHexColor(parsed.ink)
                ? parsed.ink
                : defaultThemePlaygroundSettings.ink,
            cursor: themeCursorOptions.some(
                (option) => option.value === parsed.cursor,
            )
                ? (parsed.cursor as ThemePlaygroundSettings['cursor'])
                : defaultThemePlaygroundSettings.cursor,
            backgroundEffect: themeBackgroundOptions.some(
                (option) => option.value === parsed.backgroundEffect,
            )
                ? (parsed.backgroundEffect as ThemePlaygroundSettings['backgroundEffect'])
                : defaultThemePlaygroundSettings.backgroundEffect,
        };
    } catch {
        return defaultThemePlaygroundSettings;
    }
}

type TechIconStyle = {
    keywords: string[];
    label: string;
    bg: string;
    fg: string;
    icon?: SimpleIcon;
};

const techIconStyles: TechIconStyle[] = [
    {
        keywords: ['laravel'],
        label: 'Laravel',
        bg: '#fff0ed',
        fg: '#ff2d20',
        icon: siLaravel,
    },
    {
        keywords: ['react'],
        label: 'React',
        bg: '#e8fbff',
        fg: '#149eca',
        icon: siReact,
    },
    {
        keywords: ['flutter'],
        label: 'Flutter',
        bg: '#edf6ff',
        fg: '#0468d7',
        icon: siFlutter,
    },
    {
        keywords: ['php'],
        label: 'PHP',
        bg: '#eeefff',
        fg: '#4f5b93',
        icon: siPhp,
    },
    {
        keywords: ['python'],
        label: 'Python',
        bg: '#fff7df',
        fg: '#3776ab',
        icon: siPython,
    },
    {
        keywords: ['mysql'],
        label: 'MySQL',
        bg: '#eaf6ff',
        fg: '#00618a',
        icon: siMysql,
    },
    {
        keywords: ['tailwind'],
        label: 'Tailwind CSS',
        bg: '#e8fffb',
        fg: '#06b6d4',
        icon: siTailwindcss,
    },
    {
        keywords: ['javascript'],
        label: 'JavaScript',
        bg: '#fff9d9',
        fg: '#b59b00',
        icon: siJavascript,
    },
    {
        keywords: ['typescript'],
        label: 'TypeScript',
        bg: '#eaf2ff',
        fg: '#3178c6',
        icon: siTypescript,
    },
    {
        keywords: ['node'],
        label: 'Node.js',
        bg: '#edf8ea',
        fg: '#5fa04e',
        icon: siNodedotjs,
    },
    {
        keywords: ['vue'],
        label: 'Vue',
        bg: '#eafaf2',
        fg: '#42b883',
        icon: siVuedotjs,
    },
    {
        keywords: ['docker'],
        label: 'Docker',
        bg: '#edf7ff',
        fg: '#2496ed',
        icon: siDocker,
    },
    {
        keywords: ['github'],
        label: 'GitHub',
        bg: '#f4f4f5',
        fg: '#181717',
        icon: siGithub,
    },
    {
        keywords: ['git'],
        label: 'Git',
        bg: '#fff1ed',
        fg: '#f05032',
        icon: siGit,
    },
    {
        keywords: ['langchain'],
        label: 'LangChain',
        bg: '#eef8f2',
        fg: '#1c3c3c',
        icon: siLangchain,
    },
    {
        keywords: ['ollama'],
        label: 'Ollama',
        bg: '#f4f4f5',
        fg: '#000000',
        icon: siOllama,
    },
    {
        keywords: ['raspberry'],
        label: 'Raspberry Pi',
        bg: '#fff0f4',
        fg: '#a22846',
        icon: siRaspberrypi,
    },
    {
        keywords: ['arduino'],
        label: 'Arduino',
        bg: '#e8fbfb',
        fg: '#00878f',
        icon: siArduino,
    },
    {
        keywords: ['stripe', 'payment'],
        label: 'Stripe',
        bg: '#f0edff',
        fg: '#635bff',
        icon: siStripe,
    },
    {
        keywords: ['mapbox'],
        label: 'Mapbox',
        bg: '#eef6ff',
        fg: '#000000',
        icon: siMapbox,
    },
    {
        keywords: ['leaflet'],
        label: 'Leaflet',
        bg: '#ecfdf3',
        fg: '#199900',
        icon: siLeaflet,
    },
    {
        keywords: ['openstreetmap'],
        label: 'OpenStreetMap',
        bg: '#ecfdf3',
        fg: '#7ebc6f',
        icon: siOpenstreetmap,
    },
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
    { keywords: ['iot', 'kiosk'], label: 'IoT', bg: '#fff4e6', fg: '#c2410c' },
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
        keywords: [],
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
            title={icon.label}
        >
            {icon.icon ? (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-6"
                    fill="currentColor"
                >
                    <path d={icon.icon.path} />
                </svg>
            ) : (
                icon.label
            )}
        </span>
    );
}

function BrandIcon({ icon }: { icon: SimpleIcon }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="currentColor"
        >
            <path d={icon.path} />
        </svg>
    );
}

function ThemeToggle({
    isDark,
    onToggle,
    compact = false,
}: {
    isDark: boolean;
    onToggle: () => void;
    compact?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={cx(
                'inline-flex items-center justify-center gap-2 rounded-full border border-[#151614]/12 bg-white/72 font-black text-[#151614] shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.07] dark:text-white dark:hover:bg-white/[0.12]',
                compact ? 'size-11' : 'px-4 py-2.5 text-sm',
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {compact ? null : <span>{isDark ? 'Light' : 'Dark'}</span>}
        </button>
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
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [themeSettings, setThemeSettings] = useState<ThemePlaygroundSettings>(
        loadThemePlaygroundSettings,
    );
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
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
    const [chatHasOlderMessages, setChatHasOlderMessages] = useState(false);
    const [chatLoadingOlder, setChatLoadingOlder] = useState(false);
    const chatMessageIdsRef = useRef<Set<number>>(new Set());
    const chatSoundRef = useRef<HTMLAudioElement | null>(null);
    const chatThreadRef = useRef<HTMLDivElement | null>(null);
    const shouldScrollChatToBottomRef = useRef(true);

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

        return logoProjects.length ? [...logoProjects, ...logoProjects] : [];
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
    const isDarkTheme = resolvedAppearance === 'dark';
    const themePlaygroundStyle = {
        '--theme-accent': themeSettings.accent,
        '--theme-secondary': themeSettings.secondary,
        '--theme-background': themeSettings.background,
        '--theme-surface': themeSettings.surface,
        '--theme-ink': themeSettings.ink,
    } as CSSProperties;

    function toggleTheme() {
        updateAppearance(isDarkTheme ? 'light' : 'dark');
    }

    function updateThemeSetting<K extends keyof ThemePlaygroundSettings>(
        key: K,
        value: ThemePlaygroundSettings[K],
    ) {
        setThemeSettings((currentSettings) => ({
            ...currentSettings,
            [key]: value,
        }));
    }

    function applyThemePreset(preset: (typeof themePlaygroundPresets)[number]) {
        setThemeSettings({
            accent: preset.accent,
            secondary: preset.secondary,
            background: preset.background,
            surface: preset.surface,
            ink: preset.ink,
            cursor: preset.cursor,
            backgroundEffect: preset.backgroundEffect,
        });
    }

    function playChatSound() {
        chatSoundRef.current ??= new Audio(chatSoundUrl);
        chatSoundRef.current.currentTime = 0;
        void chatSoundRef.current.play().catch(() => undefined);
    }

    function mergeChatMessages(
        currentMessages: ChatMessage[],
        nextMessages: ChatMessage[],
    ) {
        return [...currentMessages, ...nextMessages]
            .filter(
                (message, index, messages) =>
                    messages.findIndex((item) => item.id === message.id) ===
                    index,
            )
            .sort((a, b) => a.id - b.id);
    }

    async function loadChat(
        uuid: string,
        notify = true,
        beforeId: number | null = null,
    ) {
        const url = beforeId
            ? `/portfolio-chat/${uuid}?before_id=${beforeId}`
            : `/portfolio-chat/${uuid}`;
        const response = await fetch(url, {
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

        const previousIds = chatMessageIdsRef.current;
        const messages = data.messages ?? [];
        const newAdminMessages = messages.filter(
            (message) =>
                message.sender === 'admin' && !previousIds.has(message.id),
        );

        if (notify && previousIds.size > 0 && newAdminMessages.length > 0) {
            playChatSound();
            setChatUnreadCount((count) =>
                chatOpen ? 0 : count + newAdminMessages.length,
            );
            shouldScrollChatToBottomRef.current = chatOpen;
        }

        setConversationUuid(data.conversation_uuid);
        setChatHasOlderMessages(messages.length === 10);
        setChatMessages((currentMessages) => {
            const nextMessages = beforeId
                ? mergeChatMessages(messages, currentMessages)
                : mergeChatMessages(currentMessages, messages);

            chatMessageIdsRef.current = new Set(
                nextMessages.map((message) => message.id),
            );

            return nextMessages;
        });
    }

    async function loadOlderChatMessages() {
        if (!conversationUuid || !chatMessages.length || chatLoadingOlder) {
            return;
        }

        setChatLoadingOlder(true);
        shouldScrollChatToBottomRef.current = false;

        try {
            await loadChat(conversationUuid, false, chatMessages[0].id);
        } finally {
            setChatLoadingOlder(false);
        }
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
            chatMessageIdsRef.current = new Set(
                (data.messages ?? []).map((message) => message.id),
            );
            shouldScrollChatToBottomRef.current = true;
            setConversationUuid(data.conversation_uuid);
            setChatMessages(data.messages ?? []);
            setChatHasOlderMessages((data.messages ?? []).length === 10);
            setChatUnreadCount(0);
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
        window.localStorage.setItem(
            themePlaygroundStorageKey,
            JSON.stringify(themeSettings),
        );
    }, [themeSettings]);

    useEffect(() => {
        const storedUuid = window.localStorage.getItem(
            'portfolio-chat-conversation',
        );

        if (storedUuid) {
            setConversationUuid(storedUuid);
            shouldScrollChatToBottomRef.current = true;
            void loadChat(storedUuid, false);
        }
    }, []);

    useEffect(() => {
        if (!conversationUuid) {
            return;
        }

        const interval = window.setInterval(() => {
            void loadChat(conversationUuid);
        }, 5000);

        return () => window.clearInterval(interval);
    }, [conversationUuid, chatOpen]);

    useEffect(() => {
        if (chatOpen) {
            setChatUnreadCount(0);
            shouldScrollChatToBottomRef.current = true;
        }
    }, [chatOpen]);

    useEffect(() => {
        if (!chatOpen || !shouldScrollChatToBottomRef.current) {
            return;
        }

        window.requestAnimationFrame(() => {
            if (chatThreadRef.current) {
                chatThreadRef.current.scrollTop =
                    chatThreadRef.current.scrollHeight;
            }
        });
    }, [chatOpen, chatMessages]);

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
            <main
                className="portfolio-theme-playground min-h-screen bg-[#f8f9f6] text-[#151614] transition-colors selection:bg-[#c6ff4a] selection:text-[#151614] dark:bg-[#0f110f] dark:text-[#f8f9f6]"
                data-theme-background={themeSettings.backgroundEffect}
                data-theme-cursor={themeSettings.cursor}
                style={themePlaygroundStyle}
            >
                <div className="portfolio-bg-grid pointer-events-none fixed inset-0 z-0 [background-image:linear-gradient(rgba(21,22,20,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(21,22,20,0.08)_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.45] dark:[background-image:linear-gradient(rgba(248,249,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(248,249,246,0.08)_1px,transparent_1px)]" />
                <div className="portfolio-bg-glow pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_12%,rgba(198,255,74,0.24),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(30,214,196,0.18),transparent_28%),radial-gradient(circle_at_65%_86%,rgba(255,91,91,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_18%_12%,rgba(198,255,74,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(30,214,196,0.16),transparent_28%),radial-gradient(circle_at_65%_86%,rgba(255,91,91,0.1),transparent_24%)]" />
                <div className="portfolio-cursor-glow pointer-events-none fixed inset-0 z-[1]" />

                <header
                    data-reveal="fade-down"
                    className="reveal-delay-1 fixed top-0 right-0 left-0 z-50 border-b border-[#151614]/10 bg-[#f8f9f6]/82 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#0f110f]/82"
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                        <a href="#" className="group flex items-center gap-3">
                            <span className="grid size-11 place-items-center overflow-hidden rounded-full border border-[#151614] bg-white shadow-[5px_5px_0_#c6ff4a] transition-transform group-hover:-translate-y-0.5 dark:border-white/20 dark:bg-white">
                                <AppLogoIcon className="h-full w-full object-contain p-1" />
                            </span>
                            <span>
                                <span className="block text-sm font-black tracking-[0.18em] uppercase">
                                    Michael De Leon
                                </span>
                                <span className="block text-xs text-[#5c635b] dark:text-white/55">
                                    Full-stack systems engineer
                                </span>
                            </span>
                        </a>

                        <nav className="hidden items-center gap-1 rounded-full border border-[#151614]/10 bg-white/70 p-1 text-sm font-semibold lg:flex dark:border-white/10 dark:bg-white/[0.07]">
                            {navItems.map(([label, href]) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="rounded-full px-4 py-2 text-[#3d433c] transition hover:bg-[#151614] hover:text-white dark:text-white/70 dark:hover:bg-white dark:hover:text-[#151614]"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-3 lg:flex">
                            <ThemeToggle
                                isDark={isDarkTheme}
                                onToggle={toggleTheme}
                            />
                            <a
                                href={`mailto:${profile.email}`}
                                className="inline-flex items-center gap-2 rounded-full bg-[#151614] px-5 py-2.5 text-sm font-black text-white shadow-[5px_5px_0_#1ed6c4] transition hover:-translate-y-0.5"
                            >
                                Start a project
                                <ArrowUpRight className="size-4" />
                            </a>
                        </div>

                        <div className="flex items-center gap-2 lg:hidden">
                            <ThemeToggle
                                isDark={isDarkTheme}
                                onToggle={toggleTheme}
                                compact
                            />
                            <button
                                type="button"
                                aria-label="Toggle navigation"
                                onClick={() => setMenuOpen((open) => !open)}
                                className="grid size-11 place-items-center rounded-full border border-[#151614]/15 bg-white dark:border-white/10 dark:bg-white/[0.07]"
                            >
                                {menuOpen ? (
                                    <X className="size-5" />
                                ) : (
                                    <Menu className="size-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {menuOpen ? (
                        <div className="border-t border-[#151614]/10 bg-[#f8f9f6] px-5 py-4 lg:hidden dark:border-white/10 dark:bg-[#0f110f]">
                            <div className="grid gap-2">
                                {navItems.map(([label, href]) => (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-xl border border-[#151614]/10 bg-white px-4 py-3 font-bold dark:border-white/10 dark:bg-white/[0.07]"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </header>

                <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 pt-32 pb-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pt-28">
                    <div>
                        <div
                            data-reveal
                            className="reveal-delay-2 mb-7 inline-flex items-center gap-3 rounded-full border border-[#151614]/12 bg-white/80 px-4 py-2 text-sm font-bold text-[#3d433c] shadow-sm dark:border-white/10 dark:bg-white/[0.07] dark:text-white/75"
                        >
                            <span className="size-2.5 rounded-full bg-[#1ed6c4] shadow-[0_0_0_6px_rgba(30,214,196,0.18)]" />
                            {profile.availability}
                        </div>

                        <p
                            data-reveal
                            className="reveal-delay-3 mb-5 text-sm font-black tracking-[0.28em] text-[#5a6257] uppercase dark:text-white/45"
                        >
                            {profile.role}
                        </p>
                        <h1
                            data-reveal
                            className="reveal-delay-4 max-w-5xl text-5xl leading-[0.92] font-black tracking-[-0.06em] text-[#151614] sm:text-7xl lg:text-[6.8rem] dark:text-white"
                        >
                            {profile.name}
                        </h1>
                        <p
                            data-reveal
                            className="reveal-delay-5 mt-8 max-w-2xl text-xl leading-8 text-[#333933] sm:text-2xl sm:leading-10 dark:text-white/68"
                        >
                            {profile.tagline}
                        </p>

                        <div
                            data-reveal
                            className="reveal-delay-6 mt-9 flex flex-col gap-3 sm:flex-row"
                        >
                            <a
                                href="#work"
                                className="theme-primary-cta inline-flex items-center justify-center gap-2 rounded-full bg-[#c6ff4a] px-6 py-4 text-sm font-black text-[#151614] shadow-[6px_6px_0_#151614] transition hover:-translate-y-0.5"
                            >
                                View selected work
                                <ChevronRight className="size-4" />
                            </a>
                            <a
                                href="/michael-de-leon-resume.pdf"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#151614]/15 bg-white px-6 py-4 text-sm font-black text-[#151614] transition hover:border-[#151614] dark:border-white/12 dark:bg-white/[0.09] dark:text-white dark:hover:border-white/35"
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
                                    className="border-t border-[#151614]/15 pt-4 dark:border-white/12"
                                >
                                    <div className="text-4xl font-black tracking-[-0.06em]">
                                        {metric.value}
                                    </div>
                                    <div className="mt-1 text-sm leading-5 font-semibold text-[#5c635b] dark:text-white/55">
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

                {projectLogoStrip.length ? (
                    <section
                        data-reveal
                        className="project-logo-strip relative z-10 overflow-hidden border-y border-[#151614]/10 bg-white/35 py-8 text-[#151614] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02] dark:text-white"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(198,255,74,0.2),transparent_26%),radial-gradient(circle_at_80%_50%,rgba(30,214,196,0.18),transparent_30%)] dark:bg-[radial-gradient(circle_at_18%_50%,rgba(198,255,74,0.1),transparent_28%),radial-gradient(circle_at_80%_50%,rgba(30,214,196,0.12),transparent_32%)]" />
                        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
                            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#151614]/10 bg-white/72 py-5 shadow-[8px_8px_0_rgba(198,255,74,0.42)] backdrop-blur-xl dark:border-white/10 dark:bg-[#151614]/64 dark:shadow-[8px_8px_0_rgba(30,214,196,0.38)]">
                                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white/95 to-transparent dark:from-[#151614]" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white/95 to-transparent dark:from-[#151614]" />
                                <div className="project-logo-track flex w-max items-center gap-16 px-10">
                                    {projectLogoStrip.map((project, index) => (
                                        <div
                                            key={`${project.id}-${index}`}
                                            className="grid h-20 w-48 shrink-0 place-items-center sm:w-56"
                                            title={project.title}
                                        >
                                            <img
                                                src={project.logo_url ?? ''}
                                                alt={`${project.title} logo`}
                                                className="project-logo-image max-h-16 w-full max-w-48 object-contain opacity-80 transition duration-300 hover:scale-105 hover:opacity-100 sm:max-h-[4.5rem] sm:max-w-52"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}

                <section
                    id="work"
                    className="relative z-10 mx-auto max-w-7xl px-5 py-24 lg:px-8"
                >
                    <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr]">
                        <div
                            data-reveal
                            className="lg:sticky lg:top-28 lg:self-start"
                        >
                            <p className="text-sm font-black tracking-[0.28em] text-[#5a6257] uppercase dark:text-white/45">
                                Selected work
                            </p>
                            <h2 className="mt-4 text-4xl leading-[0.98] font-black tracking-[-0.06em] sm:text-6xl">
                                Built for messy operations, not just pretty
                                screens.
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-[#4d554c] dark:text-white/62">
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
                                                ? 'border-[#151614] bg-[#151614] text-white dark:border-[#c6ff4a] dark:bg-[#c6ff4a] dark:text-[#151614]'
                                                : 'border-[#151614]/12 bg-white text-[#394038] hover:border-[#151614] dark:border-white/12 dark:bg-white/[0.08] dark:text-white/74 dark:hover:border-white/35 dark:hover:bg-white/[0.12]',
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
                                    <article className="work-card-shell group rounded-[1.35rem] border border-[#151614]/10 bg-white p-5 text-[#151614] shadow-sm transition hover:border-[#151614]/35 hover:shadow-md sm:p-7 dark:border-white/12 dark:bg-[#171a17]/92 dark:text-white dark:shadow-[8px_8px_0_rgba(30,214,196,0.14)] dark:hover:border-white/28">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 text-xs font-black tracking-[0.18em] text-[#63705e] uppercase dark:text-white/50">
                                                    <span>
                                                        {project.category}
                                                    </span>
                                                    <span className="text-[#151614]/25 dark:text-white/20">
                                                        /
                                                    </span>
                                                    <span>{project.year}</span>
                                                    <span className="rounded-full bg-[#edf0e9] px-2.5 py-1 tracking-normal text-[#394038] dark:bg-white/10 dark:text-white/68">
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
                                                    className="inline-flex items-center gap-2 rounded-full border border-[#151614]/15 px-4 py-2 text-sm font-black transition hover:border-[#151614] hover:bg-[#151614] hover:text-white dark:border-white/12 dark:text-white/75 dark:hover:border-[#c6ff4a] dark:hover:bg-[#c6ff4a] dark:hover:text-[#151614]"
                                                >
                                                    Visit
                                                    <ArrowUpRight className="size-4" />
                                                </a>
                                            ) : null}
                                        </div>

                                        <p className="work-card-summary mt-5 text-base leading-7 text-[#4d554c] dark:text-white/66">
                                            {project.summary}
                                        </p>
                                        {project.impact ? (
                                            <div className="work-card-impact mt-5 rounded-2xl bg-[#f3f5f0] p-4 text-sm leading-6 font-semibold text-[#343b32] dark:bg-white/[0.07] dark:text-white/74">
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
                                                        className="rounded-full border border-[#151614]/10 bg-[#fbfcf9] px-3 py-1.5 text-xs font-bold text-[#4f574c] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/68"
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
                                                    ? 'border-[#c6ff4a] bg-[#c6ff4a] text-[#151614] shadow-[8px_8px_0_#1ed6c4]'
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

                                    <div className="relative min-h-96 rounded-[1.5rem] border border-white/12 bg-[#f8f9f6] p-4 text-[#151614] dark:bg-[#171a17] dark:text-white">
                                        <div className="absolute inset-4 rounded-[1.25rem] border border-dashed border-[#151614]/12 dark:border-white/12" />
                                        <div className="relative grid h-full gap-3 sm:grid-cols-2">
                                            {activeTechItems.map(
                                                (item, index) => (
                                                    <div
                                                        key={`${activeCapability.title}-${item}`}
                                                        className="capability-tech-node flex items-center gap-3 rounded-2xl border border-[#151614]/10 bg-white/86 p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#151614]/30 hover:shadow-md dark:border-white/10 dark:bg-white/[0.07] dark:hover:border-white/30"
                                                        style={{
                                                            transitionDelay: `${index * 35}ms`,
                                                        }}
                                                    >
                                                        <TechIcon name={item} />
                                                        <span className="min-w-0">
                                                            <span className="block truncate text-sm font-black">
                                                                {item}
                                                            </span>
                                                            <span className="block text-xs font-bold text-[#5c635b] dark:text-white/48">
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
                            <p className="text-sm font-black tracking-[0.28em] text-[#5a6257] uppercase dark:text-white/45">
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
                                    className="rounded-[1.35rem] border border-[#151614]/10 bg-white p-6 text-[#151614] shadow-sm dark:border-white/12 dark:bg-[#171a17]/92 dark:text-white dark:shadow-[8px_8px_0_rgba(198,255,74,0.12)]"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black tracking-[-0.04em]">
                                                {experience.role}
                                            </h3>
                                            <p className="mt-1 font-bold text-[#4d554c] dark:text-white/62">
                                                {experience.organization}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-[#edf0e9] px-3 py-1.5 text-sm font-black text-[#394038] dark:bg-white/10 dark:text-white/68">
                                            {experience.period}
                                        </span>
                                    </div>
                                    {experience.summary ? (
                                        <p className="mt-5 leading-7 text-[#4d554c] dark:text-white/66">
                                            {experience.summary}
                                        </p>
                                    ) : null}
                                    <ul className="mt-5 grid gap-3">
                                        {(experience.bullets ?? []).map(
                                            (bullet) => (
                                                <li
                                                    key={bullet}
                                                    className="flex gap-3 text-sm leading-6 text-[#4d554c] dark:text-white/64"
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
                    <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#151614] bg-[#c6ff4a] p-6 text-[#151614] shadow-[-10px_10px_0_#151614] sm:p-10 lg:p-14 dark:border-[#c6ff4a] dark:shadow-[-10px_10px_0_rgba(30,214,196,0.42)]">
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
                            {profile.facebook_url ? (
                                <a
                                    href={profile.facebook_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#151614]/20 bg-white/60 px-4 py-2 text-sm font-black"
                                >
                                    <BrandIcon icon={siFacebook} />
                                    Facebook
                                </a>
                            ) : null}
                            {profile.instagram_url ? (
                                <a
                                    href={profile.instagram_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#151614]/20 bg-white/60 px-4 py-2 text-sm font-black"
                                >
                                    <BrandIcon icon={siInstagram} />
                                    Instagram
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

                {settingsOpen ? (
                    <aside className="theme-settings-panel fixed bottom-24 left-4 z-[60] w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[1.5rem] border border-[#151614] bg-[#f8f9f6] text-[#151614] shadow-[10px_10px_0_#151614] dark:border-white/12 dark:bg-[#171a17] dark:text-white dark:shadow-[10px_10px_0_rgba(198,255,74,0.35)]">
                        <div className="flex items-start justify-between gap-4 border-b border-[#151614]/10 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/[0.06]">
                            <div>
                                <p className="text-xs font-black tracking-[0.24em] text-[#5a6257] uppercase dark:text-white/45">
                                    Theme lab
                                </p>
                                <h3 className="mt-1 text-xl font-black tracking-[-0.04em]">
                                    Play with the website look
                                </h3>
                                <p className="mt-1 text-xs font-semibold text-[#5c635b] dark:text-white/55">
                                    Saved only on this browser.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSettingsOpen(false)}
                                className="grid size-9 shrink-0 place-items-center rounded-full border border-[#151614]/10 bg-white dark:border-white/10 dark:bg-white/[0.08]"
                                aria-label="Close theme settings"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-5 py-5">
                            <div>
                                <p className="mb-3 text-xs font-black tracking-[0.2em] text-[#5a6257] uppercase dark:text-white/45">
                                    Fast presets
                                </p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {themePlaygroundPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() =>
                                                applyThemePreset(preset)
                                            }
                                            className="group rounded-2xl border border-[#151614]/10 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#151614]/35 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-white/30"
                                        >
                                            <span className="mb-3 flex gap-1.5">
                                                {[
                                                    preset.accent,
                                                    preset.secondary,
                                                    preset.background,
                                                ].map((color) => (
                                                    <span
                                                        key={`${preset.name}-${color}`}
                                                        className="size-5 rounded-full border border-[#151614]/12 dark:border-white/20"
                                                        style={{
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                ))}
                                            </span>
                                            <span className="block text-sm font-black">
                                                {preset.name}
                                            </span>
                                            <span className="mt-1 block text-xs font-semibold text-[#5c635b] dark:text-white/50">
                                                {preset.note}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-black tracking-[0.2em] text-[#5a6257] uppercase dark:text-white/45">
                                    Accent swatches
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {themeAccentSwatches.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() =>
                                                updateThemeSetting(
                                                    'accent',
                                                    color,
                                                )
                                            }
                                            className={cx(
                                                'size-9 rounded-full border transition hover:scale-110',
                                                themeSettings.accent.toLowerCase() ===
                                                    color.toLowerCase()
                                                    ? 'border-[#151614] ring-2 ring-[#151614]/20 dark:border-white dark:ring-white/20'
                                                    : 'border-[#151614]/12 dark:border-white/20',
                                            )}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Use ${color} accent`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {(
                                    [
                                        ['accent', 'Theme color'],
                                        ['secondary', 'Glow color'],
                                        ['background', 'Background'],
                                        ['surface', 'Card surface'],
                                        ['ink', 'Text color'],
                                    ] as Array<
                                        [
                                            keyof Pick<
                                                ThemePlaygroundSettings,
                                                | 'accent'
                                                | 'secondary'
                                                | 'background'
                                                | 'surface'
                                                | 'ink'
                                            >,
                                            string,
                                        ]
                                    >
                                ).map(([key, label]) => (
                                    <label
                                        key={key}
                                        className="rounded-2xl border border-[#151614]/10 bg-white p-3 text-sm font-black dark:border-white/10 dark:bg-white/[0.06]"
                                    >
                                        <span className="mb-2 block text-xs tracking-[0.16em] text-[#5a6257] uppercase dark:text-white/45">
                                            {label}
                                        </span>
                                        <span className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={themeSettings[key]}
                                                onChange={(event) =>
                                                    updateThemeSetting(
                                                        key,
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-10 w-12 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                                            />
                                            <input
                                                value={themeSettings[key]}
                                                onChange={(event) =>
                                                    updateThemeSetting(
                                                        key,
                                                        event.target.value,
                                                    )
                                                }
                                                className="min-w-0 flex-1 rounded-xl border border-[#151614]/10 bg-[#f8f9f6] px-3 py-2 text-xs font-black uppercase outline-none focus:border-[#151614] dark:border-white/12 dark:bg-[#0f110f] dark:text-white dark:focus:border-[#c6ff4a]"
                                            />
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-[#151614]/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.06]">
                                    <p className="mb-3 text-xs font-black tracking-[0.16em] text-[#5a6257] uppercase dark:text-white/45">
                                        Cursor effect
                                    </p>
                                    <div className="grid gap-2">
                                        {themeCursorOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    updateThemeSetting(
                                                        'cursor',
                                                        option.value,
                                                    )
                                                }
                                                className={cx(
                                                    'rounded-full border px-3 py-2 text-xs font-black transition',
                                                    themeSettings.cursor ===
                                                        option.value
                                                        ? 'border-[#151614] bg-[#151614] text-white dark:border-[#c6ff4a] dark:bg-[#c6ff4a] dark:text-[#151614]'
                                                        : 'border-[#151614]/10 bg-[#f8f9f6] text-[#394038] dark:border-white/10 dark:bg-white/[0.05] dark:text-white/68',
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#151614]/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.06]">
                                    <p className="mb-3 text-xs font-black tracking-[0.16em] text-[#5a6257] uppercase dark:text-white/45">
                                        Background
                                    </p>
                                    <div className="grid gap-2">
                                        {themeBackgroundOptions.map(
                                            (option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() =>
                                                        updateThemeSetting(
                                                            'backgroundEffect',
                                                            option.value,
                                                        )
                                                    }
                                                    className={cx(
                                                        'rounded-full border px-3 py-2 text-xs font-black transition',
                                                        themeSettings.backgroundEffect ===
                                                            option.value
                                                            ? 'border-[#151614] bg-[#151614] text-white dark:border-[#c6ff4a] dark:bg-[#c6ff4a] dark:text-[#151614]'
                                                            : 'border-[#151614]/10 bg-[#f8f9f6] text-[#394038] dark:border-white/10 dark:bg-white/[0.05] dark:text-white/68',
                                                    )}
                                                >
                                                    {option.label}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setThemeSettings(
                                        defaultThemePlaygroundSettings,
                                    )
                                }
                                className="inline-flex w-full items-center justify-center rounded-full border border-[#151614]/10 bg-white px-5 py-3 text-sm font-black transition hover:border-[#151614] dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-white/35"
                            >
                                Reset theme lab
                            </button>
                        </div>
                    </aside>
                ) : null}

                {chatOpen ? (
                    <aside className="fixed right-4 bottom-24 z-[60] w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[1.5rem] border border-[#151614] bg-[#f8f9f6] text-[#151614] shadow-[-10px_10px_0_#151614] dark:border-white/12 dark:bg-[#171a17] dark:text-white dark:shadow-[-10px_10px_0_rgba(198,255,74,0.35)]">
                        <div className="flex items-center justify-between border-b border-[#151614]/10 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center overflow-hidden rounded-full border border-[#151614] bg-white shadow-[4px_4px_0_#c6ff4a]">
                                    <AppLogoIcon className="h-full w-full object-contain p-1" />
                                </span>
                                <div>
                                    <p className="text-sm font-black">
                                        Chat with Michael
                                    </p>
                                    <p className="text-xs font-semibold text-[#5c635b] dark:text-white/55">
                                        I usually reply as soon as I can.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setChatOpen(false)}
                                className="grid size-9 place-items-center rounded-full border border-[#151614]/10 bg-white dark:border-white/10 dark:bg-white/[0.08]"
                                aria-label="Close chat"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div
                            ref={chatThreadRef}
                            className="max-h-[24rem] space-y-3 overflow-y-auto px-5 py-4"
                        >
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

                            {chatHasOlderMessages && chatMessages.length ? (
                                <button
                                    type="button"
                                    onClick={() => void loadOlderChatMessages()}
                                    disabled={chatLoadingOlder}
                                    className="mx-auto flex rounded-full border border-[#151614]/10 bg-white px-4 py-2 text-xs font-black text-[#151614] disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.08] dark:text-white"
                                >
                                    {chatLoadingOlder
                                        ? 'Loading...'
                                        : 'Load older messages'}
                                </button>
                            ) : null}

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
                                                    : 'rounded-tl-sm bg-white text-[#151614] shadow-sm dark:bg-white/[0.08] dark:text-white',
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

                        <div className="border-t border-[#151614]/10 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/[0.06]">
                            {!conversationUuid ? (
                                <div className="mb-3 grid gap-2 sm:grid-cols-2">
                                    <input
                                        value={chatName}
                                        onChange={(event) =>
                                            setChatName(event.target.value)
                                        }
                                        placeholder="Name"
                                        className="rounded-xl border border-[#151614]/12 bg-[#f8f9f6] px-3 py-2 text-sm font-semibold outline-none focus:border-[#151614] dark:border-white/12 dark:bg-[#0f110f] dark:text-white dark:placeholder:text-white/35 dark:focus:border-[#c6ff4a]"
                                    />
                                    <input
                                        type="email"
                                        value={chatEmail}
                                        onChange={(event) =>
                                            setChatEmail(event.target.value)
                                        }
                                        placeholder="Email"
                                        className="rounded-xl border border-[#151614]/12 bg-[#f8f9f6] px-3 py-2 text-sm font-semibold outline-none focus:border-[#151614] dark:border-white/12 dark:bg-[#0f110f] dark:text-white dark:placeholder:text-white/35 dark:focus:border-[#c6ff4a]"
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
                                className="w-full resize-none rounded-2xl border border-[#151614]/12 bg-[#f8f9f6] px-4 py-3 text-sm font-semibold outline-none focus:border-[#151614] dark:border-white/12 dark:bg-[#0f110f] dark:text-white dark:placeholder:text-white/35 dark:focus:border-[#c6ff4a]"
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
                    onClick={() => setSettingsOpen((open) => !open)}
                    className="theme-settings-button fixed bottom-5 left-4 z-[60] inline-flex items-center gap-3 rounded-full bg-[#151614] px-5 py-3 text-sm font-black text-white shadow-[6px_6px_0_#c6ff4a] transition hover:-translate-y-0.5"
                >
                    <Settings className="size-5" />
                    <span className="hidden sm:inline">Theme settings</span>
                </button>

                <button
                    type="button"
                    onClick={() => setChatOpen((open) => !open)}
                    className="fixed right-4 bottom-5 z-[60] inline-flex items-center gap-3 rounded-full bg-[#151614] px-5 py-3 text-sm font-black text-white shadow-[-6px_6px_0_#c6ff4a] transition hover:-translate-y-0.5"
                >
                    {chatUnreadCount > 0 ? (
                        <span className="absolute -top-3 right-2 rounded-full bg-[#ff5b5b] px-3 py-1 text-[0.68rem] font-black text-white shadow-[0_8px_20px_rgba(255,91,91,0.28)]">
                            {chatUnreadCount} new message
                            {chatUnreadCount === 1 ? '' : 's'}
                        </span>
                    ) : null}
                    <MessageCircle className="size-5" />
                    Chat with me
                </button>
            </main>
        </>
    );
}
