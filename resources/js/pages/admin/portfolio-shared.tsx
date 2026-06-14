import type { ReactNode } from 'react';

export type Metric = {
    value: string;
    label: string;
};

export type Service = {
    title: string;
    body: string;
};

export type PortfolioProfile = {
    id?: number;
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

export type PortfolioProject = {
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

export type PortfolioExperience = {
    id: number;
    role: string;
    organization: string;
    period: string;
    summary?: string | null;
    bullets?: string[] | null;
};

export type SkillGroup = {
    id: number;
    name: string;
    items: string[];
};

export const emptyProfile: PortfolioProfile = {
    name: '',
    role: '',
    tagline: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    website_url: '',
    github_url: '',
    linkedin_url: '',
    facebook_url: '',
    instagram_url: '',
    availability: '',
    metrics: [],
    services: [],
};

export function fieldClass(hasError?: string) {
    return [
        'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-lime-300/40 dark:bg-neutral-950',
        hasError
            ? 'border-red-500'
            : 'border-neutral-200 dark:border-neutral-800',
    ].join(' ');
}

export function FieldError({ error }: { error?: string }) {
    if (!error) {
        return null;
    }

    return <p className="mt-1 text-sm font-medium text-red-600">{error}</p>;
}

export function AdminHero({
    eyebrow,
    title,
    body,
    action,
}: {
    eyebrow: string;
    title: string;
    body: string;
    action?: ReactNode;
}) {
    return (
        <section className="rounded-3xl border border-neutral-200 bg-[#c6ff4a] p-6 shadow-[8px_8px_0_#171717] dark:border-neutral-800 dark:text-neutral-950">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-black tracking-[0.24em] uppercase">
                        {eyebrow}
                    </p>
                    <h1 className="mt-3 max-w-3xl text-4xl leading-[0.95] font-black tracking-[-0.06em] sm:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 font-semibold text-neutral-800">
                        {body}
                    </p>
                </div>
                {action}
            </div>
        </section>
    );
}
