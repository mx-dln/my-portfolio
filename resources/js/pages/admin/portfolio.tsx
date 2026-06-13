import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowUpRight,
    BriefcaseBusiness,
    CheckCircle2,
    ExternalLink,
    ImageIcon,
    Plus,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';

type PortfolioProfile = {
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
    availability?: string | null;
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
};

type SkillGroup = {
    id: number;
    name: string;
    items: string[];
};

type PortfolioAdminProps = {
    profile: PortfolioProfile | null;
    projects: PortfolioProject[];
    experiences: PortfolioExperience[];
    skillGroups: SkillGroup[];
};

const emptyProfile: PortfolioProfile = {
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
    availability: '',
};

function fieldClass(hasError?: string) {
    return [
        'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-lime-300/40 dark:bg-neutral-950',
        hasError
            ? 'border-red-500'
            : 'border-neutral-200 dark:border-neutral-800',
    ].join(' ');
}

function FieldError({ error }: { error?: string }) {
    if (!error) {
        return null;
    }

    return <p className="mt-1 text-sm font-medium text-red-600">{error}</p>;
}

function ProjectEditor({ project }: { project: PortfolioProject }) {
    const form = useForm({
        title: project.title,
        category: project.category,
        year: project.year,
        url: project.url ?? '',
        summary: project.summary,
        impact: project.impact ?? '',
        stack_text: (project.stack ?? []).join(', '),
        status: project.status,
        featured: project.featured,
        logo: null as File | null,
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'patch' }));
        form.post(`/admin/portfolio/projects/${project.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.setData('logo', null),
        });
    }

    function remove() {
        if (!window.confirm(`Remove ${project.title}?`)) {
            return;
        }

        router.delete(`/admin/portfolio/projects/${project.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <form
            onSubmit={submit}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
                        {project.category}
                    </p>
                    <h3 className="mt-1 text-xl font-black tracking-[-0.03em]">
                        {project.title}
                    </h3>
                </div>
                <div className="flex gap-2">
                    {project.url ? (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-200"
                            aria-label="Open project"
                        >
                            <ExternalLink className="size-4" />
                        </a>
                    ) : null}
                    <button
                        type="button"
                        onClick={remove}
                        className="inline-flex size-10 items-center justify-center rounded-full border border-red-200 text-red-600"
                        aria-label="Delete project"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            </div>

            <div className="mt-5 grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:grid-cols-[8rem_1fr] md:items-center dark:border-neutral-800 dark:bg-neutral-900">
                <div className="grid aspect-square place-items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                    {project.logo_url ? (
                        <img
                            src={project.logo_url}
                            alt={`${project.title} logo`}
                            className="h-full w-full object-contain p-3"
                        />
                    ) : (
                        <ImageIcon className="size-8 text-neutral-400" />
                    )}
                </div>
                <label className="text-sm font-bold">
                    Project logo or image
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className={fieldClass(form.errors.logo)}
                        onChange={(event) =>
                            form.setData(
                                'logo',
                                event.currentTarget.files?.[0] ?? null,
                            )
                        }
                    />
                    <p className="mt-1 text-xs font-semibold text-neutral-500">
                        PNG, JPG, or WEBP. This will replace the current image.
                    </p>
                    <FieldError error={form.errors.logo} />
                </label>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                <label className="text-sm font-bold">
                    Title
                    <input
                        className={fieldClass(form.errors.title)}
                        value={form.data.title}
                        onChange={(event) =>
                            form.setData('title', event.target.value)
                        }
                    />
                    <FieldError error={form.errors.title} />
                </label>
                <label className="text-sm font-bold">
                    Category
                    <input
                        className={fieldClass(form.errors.category)}
                        value={form.data.category}
                        onChange={(event) =>
                            form.setData('category', event.target.value)
                        }
                    />
                    <FieldError error={form.errors.category} />
                </label>
                <label className="text-sm font-bold">
                    Year
                    <input
                        className={fieldClass(form.errors.year)}
                        value={form.data.year}
                        onChange={(event) =>
                            form.setData('year', event.target.value)
                        }
                    />
                    <FieldError error={form.errors.year} />
                </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-bold">
                    URL
                    <input
                        className={fieldClass(form.errors.url)}
                        value={form.data.url}
                        onChange={(event) =>
                            form.setData('url', event.target.value)
                        }
                        placeholder="https://..."
                    />
                    <FieldError error={form.errors.url} />
                </label>
                <label className="text-sm font-bold">
                    Status
                    <input
                        className={fieldClass(form.errors.status)}
                        value={form.data.status}
                        onChange={(event) =>
                            form.setData('status', event.target.value)
                        }
                    />
                    <FieldError error={form.errors.status} />
                </label>
            </div>

            <label className="mt-4 block text-sm font-bold">
                Summary
                <textarea
                    className={fieldClass(form.errors.summary)}
                    rows={3}
                    value={form.data.summary}
                    onChange={(event) =>
                        form.setData('summary', event.target.value)
                    }
                />
                <FieldError error={form.errors.summary} />
            </label>

            <label className="mt-4 block text-sm font-bold">
                Impact
                <textarea
                    className={fieldClass(form.errors.impact)}
                    rows={2}
                    value={form.data.impact}
                    onChange={(event) =>
                        form.setData('impact', event.target.value)
                    }
                />
                <FieldError error={form.errors.impact} />
            </label>

            <label className="mt-4 block text-sm font-bold">
                Stack, comma-separated
                <input
                    className={fieldClass(form.errors.stack_text)}
                    value={form.data.stack_text}
                    onChange={(event) =>
                        form.setData('stack_text', event.target.value)
                    }
                />
                <FieldError error={form.errors.stack_text} />
            </label>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-3 text-sm font-bold">
                    <input
                        type="checkbox"
                        checked={form.data.featured}
                        onChange={(event) =>
                            form.setData('featured', event.target.checked)
                        }
                        className="size-5 rounded border-neutral-300"
                    />
                    Featured on hero and selected work
                </label>
                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                >
                    Save project
                    <CheckCircle2 className="size-4" />
                </button>
            </div>
        </form>
    );
}

export default function PortfolioAdmin({
    profile,
    projects,
    experiences,
    skillGroups,
}: PortfolioAdminProps) {
    const profileForm = useForm({
        name: profile?.name ?? emptyProfile.name,
        role: profile?.role ?? emptyProfile.role,
        tagline: profile?.tagline ?? emptyProfile.tagline,
        summary: profile?.summary ?? emptyProfile.summary,
        email: profile?.email ?? emptyProfile.email,
        phone: profile?.phone ?? '',
        location: profile?.location ?? '',
        website_url: profile?.website_url ?? '',
        github_url: profile?.github_url ?? '',
        linkedin_url: profile?.linkedin_url ?? '',
        availability: profile?.availability ?? '',
    });

    const newProjectForm = useForm({
        title: '',
        category: 'Web App',
        year: new Date().getFullYear().toString(),
        url: '',
        summary: '',
        impact: '',
        stack_text: '',
        status: 'Draft',
        featured: false,
        logo: null as File | null,
    });

    function updateProfile(event: FormEvent) {
        event.preventDefault();
        profileForm.patch('/admin/portfolio/profile', {
            preserveScroll: true,
        });
    }

    function createProject(event: FormEvent) {
        event.preventDefault();
        newProjectForm.post('/admin/portfolio/projects', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => newProjectForm.reset(),
        });
    }

    return (
        <>
            <Head title="Portfolio Studio" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-7xl gap-6">
                    <section className="rounded-3xl border border-neutral-200 bg-[#c6ff4a] p-6 shadow-[8px_8px_0_#171717] dark:border-neutral-800 dark:text-neutral-950">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-sm font-black tracking-[0.24em] uppercase">
                                    Portfolio Studio
                                </p>
                                <h1 className="mt-3 max-w-3xl text-4xl leading-[0.95] font-black tracking-[-0.06em] sm:text-6xl">
                                    Keep the public website alive from here.
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-7 font-semibold text-neutral-800">
                                    Edit the profile and projects that power the
                                    public home page. Skills and experience are
                                    seeded from the resume and can be extended
                                    in the database next.
                                </p>
                            </div>
                            <a
                                href="/"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white"
                            >
                                View site
                                <ArrowUpRight className="size-4" />
                            </a>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-4">
                        {[
                            ['Projects', projects.length],
                            [
                                'Featured',
                                projects.filter((project) => project.featured)
                                    .length,
                            ],
                            ['Experience', experiences.length],
                            ['Skill groups', skillGroups.length],
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

                    <form
                        onSubmit={updateProfile}
                        className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-black tracking-[0.22em] text-neutral-500 uppercase">
                                    Public identity
                                </p>
                                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                    Hero and contact details
                                </h2>
                            </div>
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                            >
                                Save profile
                                <CheckCircle2 className="size-4" />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="text-sm font-bold">
                                Name
                                <input
                                    className={fieldClass(
                                        profileForm.errors.name,
                                    )}
                                    value={profileForm.data.name}
                                    onChange={(event) =>
                                        profileForm.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                />
                                <FieldError error={profileForm.errors.name} />
                            </label>
                            <label className="text-sm font-bold">
                                Role
                                <input
                                    className={fieldClass(
                                        profileForm.errors.role,
                                    )}
                                    value={profileForm.data.role}
                                    onChange={(event) =>
                                        profileForm.setData(
                                            'role',
                                            event.target.value,
                                        )
                                    }
                                />
                                <FieldError error={profileForm.errors.role} />
                            </label>
                        </div>

                        <label className="mt-4 block text-sm font-bold">
                            Tagline
                            <textarea
                                className={fieldClass(
                                    profileForm.errors.tagline,
                                )}
                                rows={2}
                                value={profileForm.data.tagline}
                                onChange={(event) =>
                                    profileForm.setData(
                                        'tagline',
                                        event.target.value,
                                    )
                                }
                            />
                            <FieldError error={profileForm.errors.tagline} />
                        </label>

                        <label className="mt-4 block text-sm font-bold">
                            Summary
                            <textarea
                                className={fieldClass(
                                    profileForm.errors.summary,
                                )}
                                rows={4}
                                value={profileForm.data.summary}
                                onChange={(event) =>
                                    profileForm.setData(
                                        'summary',
                                        event.target.value,
                                    )
                                }
                            />
                            <FieldError error={profileForm.errors.summary} />
                        </label>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                            {[
                                ['Email', 'email'],
                                ['Phone', 'phone'],
                                ['Location', 'location'],
                                ['Website URL', 'website_url'],
                                ['GitHub URL', 'github_url'],
                                ['LinkedIn URL', 'linkedin_url'],
                            ].map(([label, key]) => (
                                <label key={key} className="text-sm font-bold">
                                    {label}
                                    <input
                                        className={fieldClass(
                                            profileForm.errors[
                                                key as keyof typeof profileForm.errors
                                            ],
                                        )}
                                        value={
                                            profileForm.data[
                                                key as keyof typeof profileForm.data
                                            ]
                                        }
                                        onChange={(event) =>
                                            profileForm.setData(
                                                key as keyof typeof profileForm.data,
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        error={
                                            profileForm.errors[
                                                key as keyof typeof profileForm.errors
                                            ]
                                        }
                                    />
                                </label>
                            ))}
                        </div>

                        <label className="mt-4 block text-sm font-bold">
                            Availability
                            <input
                                className={fieldClass(
                                    profileForm.errors.availability,
                                )}
                                value={profileForm.data.availability}
                                onChange={(event) =>
                                    profileForm.setData(
                                        'availability',
                                        event.target.value,
                                    )
                                }
                            />
                            <FieldError
                                error={profileForm.errors.availability}
                            />
                        </label>
                    </form>

                    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                        <form
                            onSubmit={createProject}
                            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="mb-5 flex items-center gap-3">
                                <span className="grid size-11 place-items-center rounded-full bg-neutral-950 text-white">
                                    <Plus className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-black tracking-[0.22em] text-neutral-500 uppercase">
                                        Add work
                                    </p>
                                    <h2 className="text-2xl font-black tracking-[-0.04em]">
                                        New project
                                    </h2>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <label className="text-sm font-bold">
                                    Title
                                    <input
                                        className={fieldClass(
                                            newProjectForm.errors.title,
                                        )}
                                        value={newProjectForm.data.title}
                                        onChange={(event) =>
                                            newProjectForm.setData(
                                                'title',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        error={newProjectForm.errors.title}
                                    />
                                </label>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="text-sm font-bold">
                                        Category
                                        <input
                                            className={fieldClass(
                                                newProjectForm.errors.category,
                                            )}
                                            value={newProjectForm.data.category}
                                            onChange={(event) =>
                                                newProjectForm.setData(
                                                    'category',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            error={
                                                newProjectForm.errors.category
                                            }
                                        />
                                    </label>
                                    <label className="text-sm font-bold">
                                        Year
                                        <input
                                            className={fieldClass(
                                                newProjectForm.errors.year,
                                            )}
                                            value={newProjectForm.data.year}
                                            onChange={(event) =>
                                                newProjectForm.setData(
                                                    'year',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            error={newProjectForm.errors.year}
                                        />
                                    </label>
                                </div>
                                <label className="text-sm font-bold">
                                    URL
                                    <input
                                        className={fieldClass(
                                            newProjectForm.errors.url,
                                        )}
                                        value={newProjectForm.data.url}
                                        onChange={(event) =>
                                            newProjectForm.setData(
                                                'url',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://..."
                                    />
                                    <FieldError
                                        error={newProjectForm.errors.url}
                                    />
                                </label>
                                <label className="text-sm font-bold">
                                    Project logo or image
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className={fieldClass(
                                            newProjectForm.errors.logo,
                                        )}
                                        onChange={(event) =>
                                            newProjectForm.setData(
                                                'logo',
                                                event.currentTarget
                                                    .files?.[0] ?? null,
                                            )
                                        }
                                    />
                                    <p className="mt-1 text-xs font-semibold text-neutral-500">
                                        PNG, JPG, or WEBP. Max 4 MB.
                                    </p>
                                    <FieldError
                                        error={newProjectForm.errors.logo}
                                    />
                                </label>
                                <label className="text-sm font-bold">
                                    Summary
                                    <textarea
                                        className={fieldClass(
                                            newProjectForm.errors.summary,
                                        )}
                                        rows={3}
                                        value={newProjectForm.data.summary}
                                        onChange={(event) =>
                                            newProjectForm.setData(
                                                'summary',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        error={newProjectForm.errors.summary}
                                    />
                                </label>
                                <label className="text-sm font-bold">
                                    Impact
                                    <textarea
                                        className={fieldClass(
                                            newProjectForm.errors.impact,
                                        )}
                                        rows={2}
                                        value={newProjectForm.data.impact}
                                        onChange={(event) =>
                                            newProjectForm.setData(
                                                'impact',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        error={newProjectForm.errors.impact}
                                    />
                                </label>
                                <label className="text-sm font-bold">
                                    Stack, comma-separated
                                    <input
                                        className={fieldClass(
                                            newProjectForm.errors.stack_text,
                                        )}
                                        value={newProjectForm.data.stack_text}
                                        onChange={(event) =>
                                            newProjectForm.setData(
                                                'stack_text',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        error={newProjectForm.errors.stack_text}
                                    />
                                </label>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="text-sm font-bold">
                                        Status
                                        <input
                                            className={fieldClass(
                                                newProjectForm.errors.status,
                                            )}
                                            value={newProjectForm.data.status}
                                            onChange={(event) =>
                                                newProjectForm.setData(
                                                    'status',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            error={newProjectForm.errors.status}
                                        />
                                    </label>
                                    <label className="flex items-center gap-3 pt-8 text-sm font-bold">
                                        <input
                                            type="checkbox"
                                            checked={
                                                newProjectForm.data.featured
                                            }
                                            onChange={(event) =>
                                                newProjectForm.setData(
                                                    'featured',
                                                    event.target.checked,
                                                )
                                            }
                                            className="size-5 rounded border-neutral-300"
                                        />
                                        Featured
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={newProjectForm.processing}
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                            >
                                Add project
                                <Plus className="size-4" />
                            </button>
                        </form>

                        <div className="grid gap-4">
                            <div className="flex items-center gap-3">
                                <span className="grid size-11 place-items-center rounded-full bg-neutral-950 text-white">
                                    <BriefcaseBusiness className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-black tracking-[0.22em] text-neutral-500 uppercase">
                                        Manage work
                                    </p>
                                    <h2 className="text-2xl font-black tracking-[-0.04em]">
                                        Project library
                                    </h2>
                                </div>
                            </div>
                            {projects.map((project) => (
                                <ProjectEditor
                                    key={project.id}
                                    project={project}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

PortfolioAdmin.layout = {
    breadcrumbs: [
        {
            title: 'Portfolio Studio',
            href: '/admin/portfolio',
        },
    ],
};
