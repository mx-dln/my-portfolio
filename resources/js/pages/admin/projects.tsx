import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    ExternalLink,
    ImageIcon,
    LoaderCircle,
    Plus,
    Trash2,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import {
    AdminHero,
    FieldError,
    FormStatus,
    fieldClass,
    type PortfolioProject,
} from './portfolio-shared';

type ProjectsProps = {
    projects: PortfolioProject[];
};

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
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const displayLogoUrl = logoPreviewUrl ?? project.logo_url;

    useEffect(() => {
        if (!form.data.logo) {
            setLogoPreviewUrl(null);
            return;
        }

        const nextPreviewUrl = URL.createObjectURL(form.data.logo);
        setLogoPreviewUrl(nextPreviewUrl);

        return () => URL.revokeObjectURL(nextPreviewUrl);
    }, [form.data.logo]);

    function submit(event: FormEvent) {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: 'patch' }));
        form.post(`/admin/portfolio/projects/${project.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.setData('logo', null);
                setFileInputKey((key) => key + 1);
            },
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
            className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
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
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-white disabled:opacity-60 dark:bg-lime-300 dark:text-neutral-950"
                    >
                        {form.processing ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="size-4" />
                        )}
                        Save
                    </button>
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

            <div className="mt-5 grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:grid-cols-[10rem_1fr] md:items-center dark:border-neutral-800 dark:bg-neutral-900">
                <div className="grid aspect-square place-items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                    {displayLogoUrl ? (
                        <img
                            src={displayLogoUrl}
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
                        key={fileInputKey}
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
                    <p className="mt-2 text-xs font-semibold text-neutral-500">
                        {form.data.logo
                            ? form.data.logo.name
                            : 'PNG, JPG, or WebP. Maximum 4MB.'}
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

            <div className="mt-5 grid gap-3">
                <FormStatus
                    processing={form.processing}
                    progress={form.progress}
                    saved={form.recentlySuccessful}
                    label="Saving project..."
                />
            </div>

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
                    {form.processing ? 'Saving...' : 'Save project'}
                    {form.processing ? (
                        <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                        <CheckCircle2 className="size-4" />
                    )}
                </button>
            </div>
        </form>
    );
}

export default function Projects({ projects }: ProjectsProps) {
    const form = useForm({
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
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);

    useEffect(() => {
        if (!form.data.logo) {
            setLogoPreviewUrl(null);
            return;
        }

        const nextPreviewUrl = URL.createObjectURL(form.data.logo);
        setLogoPreviewUrl(nextPreviewUrl);

        return () => URL.revokeObjectURL(nextPreviewUrl);
    }, [form.data.logo]);

    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/admin/portfolio/projects', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setFileInputKey((key) => key + 1);
            },
        });
    }

    return (
        <>
            <Head title="Projects Admin" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-7xl gap-6">
                    <AdminHero
                        eyebrow="Works / projects"
                        title="Manage the proof clients care about."
                        body="Add projects, upload logos or screenshots, and tune what appears in the selected work section."
                    />

                    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                        <form
                            onSubmit={submit}
                            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
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
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60 dark:bg-lime-300 dark:text-neutral-950"
                                >
                                    {form.processing ? 'Saving...' : 'Add'}
                                    {form.processing ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="size-4" />
                                    )}
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {[
                                    ['Title', 'title'],
                                    ['Category', 'category'],
                                    ['Year', 'year'],
                                    ['URL', 'url'],
                                    ['Status', 'status'],
                                    ['Stack, comma-separated', 'stack_text'],
                                ].map(([label, key]) => (
                                    <label
                                        key={key}
                                        className="text-sm font-bold"
                                    >
                                        {label}
                                        <input
                                            className={fieldClass(
                                                form.errors[
                                                    key as keyof typeof form.errors
                                                ],
                                            )}
                                            value={
                                                form.data[
                                                    key as keyof typeof form.data
                                                ] as string
                                            }
                                            onChange={(event) =>
                                                form.setData(
                                                    key as keyof typeof form.data,
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            error={
                                                form.errors[
                                                    key as keyof typeof form.errors
                                                ]
                                            }
                                        />
                                    </label>
                                ))}

                                <label className="text-sm font-bold">
                                    Summary
                                    <textarea
                                        className={fieldClass(
                                            form.errors.summary,
                                        )}
                                        rows={3}
                                        value={form.data.summary}
                                        onChange={(event) =>
                                            form.setData(
                                                'summary',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError error={form.errors.summary} />
                                </label>

                                <label className="text-sm font-bold">
                                    Impact
                                    <textarea
                                        className={fieldClass(
                                            form.errors.impact,
                                        )}
                                        rows={2}
                                        value={form.data.impact}
                                        onChange={(event) =>
                                            form.setData(
                                                'impact',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError error={form.errors.impact} />
                                </label>

                                <label className="text-sm font-bold">
                                    Project logo or image
                                    <div className="mt-2 grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
                                        <div className="grid aspect-[16/10] place-items-center overflow-hidden rounded-xl bg-white dark:bg-neutral-900">
                                            {logoPreviewUrl ? (
                                                <img
                                                    src={logoPreviewUrl}
                                                    alt="Selected project logo preview"
                                                    className="h-full w-full object-contain p-3"
                                                />
                                            ) : (
                                                <ImageIcon className="size-8 text-neutral-400" />
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-neutral-500">
                                            {form.data.logo
                                                ? form.data.logo.name
                                                : 'Choose a project logo or screenshot before saving.'}
                                        </p>
                                    </div>
                                    <input
                                        key={fileInputKey}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className={fieldClass(form.errors.logo)}
                                        onChange={(event) =>
                                            form.setData(
                                                'logo',
                                                event.currentTarget
                                                    .files?.[0] ?? null,
                                            )
                                        }
                                    />
                                    <FieldError error={form.errors.logo} />
                                </label>

                                <label className="inline-flex items-center gap-3 text-sm font-bold">
                                    <input
                                        type="checkbox"
                                        checked={form.data.featured}
                                        onChange={(event) =>
                                            form.setData(
                                                'featured',
                                                event.target.checked,
                                            )
                                        }
                                        className="size-5 rounded border-neutral-300"
                                    />
                                    Featured project
                                </label>

                                <FormStatus
                                    processing={form.processing}
                                    progress={form.progress}
                                    saved={form.recentlySuccessful}
                                    label="Saving project..."
                                />

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                                >
                                    {form.processing
                                        ? 'Saving project...'
                                        : 'Add project'}
                                    {form.processing ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="size-4" />
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="grid gap-4">
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

Projects.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: '/admin/projects',
        },
    ],
};
