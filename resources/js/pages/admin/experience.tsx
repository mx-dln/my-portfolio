import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    AdminHero,
    FieldError,
    fieldClass,
    type PortfolioExperience,
} from './portfolio-shared';

type ExperienceProps = {
    experiences: PortfolioExperience[];
};

function ExperienceEditor({ experience }: { experience: PortfolioExperience }) {
    const form = useForm({
        role: experience.role,
        organization: experience.organization,
        period: experience.period,
        summary: experience.summary ?? '',
        bullets_text: (experience.bullets ?? []).join('\n'),
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.patch(`/admin/experience/${experience.id}`, {
            preserveScroll: true,
        });
    }

    function remove() {
        if (!window.confirm(`Remove ${experience.role}?`)) {
            return;
        }

        router.delete(`/admin/experience/${experience.id}`, {
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
                        {experience.period}
                    </p>
                    <h3 className="mt-1 text-xl font-black tracking-[-0.03em]">
                        {experience.role}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={remove}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-red-200 text-red-600"
                    aria-label="Delete experience"
                >
                    <Trash2 className="size-4" />
                </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                    ['Role', 'role'],
                    ['Organization', 'organization'],
                    ['Period', 'period'],
                ].map(([label, key]) => (
                    <label key={key} className="text-sm font-bold">
                        {label}
                        <input
                            className={fieldClass(
                                form.errors[key as keyof typeof form.errors],
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
                            error={form.errors[key as keyof typeof form.errors]}
                        />
                    </label>
                ))}
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
                Highlights, one per line
                <textarea
                    className={fieldClass(form.errors.bullets_text)}
                    rows={4}
                    value={form.data.bullets_text}
                    onChange={(event) =>
                        form.setData('bullets_text', event.target.value)
                    }
                />
                <FieldError error={form.errors.bullets_text} />
            </label>

            <button
                type="submit"
                disabled={form.processing}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
            >
                Save experience
                <CheckCircle2 className="size-4" />
            </button>
        </form>
    );
}

export default function Experience({ experiences }: ExperienceProps) {
    const form = useForm({
        role: '',
        organization: '',
        period: '',
        summary: '',
        bullets_text: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/admin/experience', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <>
            <Head title="Experience Admin" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-7xl gap-6">
                    <AdminHero
                        eyebrow="Experience"
                        title="Manage the timeline."
                        body="Edit the roles, organizations, dates, summaries, and bullet highlights shown on the public experience section."
                    />

                    <section className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
                        <form
                            onSubmit={submit}
                            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="mb-5 flex items-center gap-3">
                                <span className="grid size-11 place-items-center rounded-full bg-neutral-950 text-white">
                                    <Plus className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-black tracking-[0.22em] text-neutral-500 uppercase">
                                        Add experience
                                    </p>
                                    <h2 className="text-2xl font-black tracking-[-0.04em]">
                                        New role
                                    </h2>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {[
                                    ['Role', 'role'],
                                    ['Organization', 'organization'],
                                    ['Period', 'period'],
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
                                                ]
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
                                    Highlights, one per line
                                    <textarea
                                        className={fieldClass(
                                            form.errors.bullets_text,
                                        )}
                                        rows={4}
                                        value={form.data.bullets_text}
                                        onChange={(event) =>
                                            form.setData(
                                                'bullets_text',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        error={form.errors.bullets_text}
                                    />
                                </label>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                                >
                                    Add role
                                    <CheckCircle2 className="size-4" />
                                </button>
                            </div>
                        </form>

                        <div className="grid gap-4">
                            {experiences.map((experience) => (
                                <ExperienceEditor
                                    key={experience.id}
                                    experience={experience}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

Experience.layout = {
    breadcrumbs: [
        {
            title: 'Experience',
            href: '/admin/experience',
        },
    ],
};
