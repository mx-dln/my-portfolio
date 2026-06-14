import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    AdminHero,
    emptyProfile,
    FieldError,
    FormStatus,
    fieldClass,
    type PortfolioProfile,
} from './portfolio-shared';

type HeroProps = {
    profile: PortfolioProfile | null;
};

export default function Hero({ profile }: HeroProps) {
    const form = useForm({
        name: profile?.name ?? emptyProfile.name,
        role: profile?.role ?? emptyProfile.role,
        tagline: profile?.tagline ?? emptyProfile.tagline,
        summary: profile?.summary ?? emptyProfile.summary,
        availability: profile?.availability ?? '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.patch('/admin/hero', {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Hero Admin" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-5xl gap-6">
                    <AdminHero
                        eyebrow="Hero page"
                        title="Shape the first impression."
                        body="This controls the headline, role, intro, and availability pill on the public front page."
                    />

                    <form
                        onSubmit={submit}
                        className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-black tracking-[0.22em] text-neutral-500 uppercase">
                                    Public identity
                                </p>
                                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                    Hero content
                                </h2>
                            </div>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                            >
                                {form.processing ? 'Saving...' : 'Save hero'}
                                {form.processing ? (
                                    <LoaderCircle className="size-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="size-4" />
                                )}
                            </button>
                        </div>

                        <div className="mt-4">
                            <FormStatus
                                processing={form.processing}
                                progress={form.progress}
                                saved={form.recentlySuccessful}
                                label="Saving hero..."
                            />
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="text-sm font-bold">
                                Name
                                <input
                                    className={fieldClass(form.errors.name)}
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                />
                                <FieldError error={form.errors.name} />
                            </label>
                            <label className="text-sm font-bold">
                                Role
                                <input
                                    className={fieldClass(form.errors.role)}
                                    value={form.data.role}
                                    onChange={(event) =>
                                        form.setData('role', event.target.value)
                                    }
                                />
                                <FieldError error={form.errors.role} />
                            </label>
                        </div>

                        <label className="mt-4 block text-sm font-bold">
                            Hero tagline
                            <textarea
                                className={fieldClass(form.errors.tagline)}
                                rows={3}
                                value={form.data.tagline}
                                onChange={(event) =>
                                    form.setData('tagline', event.target.value)
                                }
                            />
                            <FieldError error={form.errors.tagline} />
                        </label>

                        <label className="mt-4 block text-sm font-bold">
                            Summary
                            <textarea
                                className={fieldClass(form.errors.summary)}
                                rows={5}
                                value={form.data.summary}
                                onChange={(event) =>
                                    form.setData('summary', event.target.value)
                                }
                            />
                            <FieldError error={form.errors.summary} />
                        </label>

                        <label className="mt-4 block text-sm font-bold">
                            Availability
                            <input
                                className={fieldClass(form.errors.availability)}
                                value={form.data.availability}
                                onChange={(event) =>
                                    form.setData(
                                        'availability',
                                        event.target.value,
                                    )
                                }
                            />
                            <FieldError error={form.errors.availability} />
                        </label>
                    </form>
                </div>
            </div>
        </>
    );
}

Hero.layout = {
    breadcrumbs: [
        {
            title: 'Hero',
            href: '/admin/hero',
        },
    ],
};
