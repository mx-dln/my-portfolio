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

type ContactProps = {
    profile: PortfolioProfile | null;
};

export default function Contact({ profile }: ContactProps) {
    const form = useForm({
        email: profile?.email ?? emptyProfile.email,
        phone: profile?.phone ?? '',
        location: profile?.location ?? '',
        website_url: profile?.website_url ?? '',
        github_url: profile?.github_url ?? '',
        linkedin_url: profile?.linkedin_url ?? '',
        facebook_url: profile?.facebook_url ?? '',
        instagram_url: profile?.instagram_url ?? '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.patch('/admin/contact', {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Links & Contact Admin" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-5xl gap-6">
                    <AdminHero
                        eyebrow="Links & contact"
                        title="Keep every contact path fresh."
                        body="Update the public contact section, external links, and social profiles from one focused page."
                    />

                    <form
                        onSubmit={submit}
                        className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-black tracking-[0.22em] text-neutral-500 uppercase">
                                    Public contact details
                                </p>
                                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                    Email, links, and socials
                                </h2>
                            </div>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                            >
                                {form.processing ? 'Saving...' : 'Save contact'}
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
                                label="Saving contact details..."
                            />
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {[
                                ['Email', 'email'],
                                ['Phone', 'phone'],
                                ['Location', 'location'],
                                ['Website URL', 'website_url'],
                                ['GitHub URL', 'github_url'],
                                ['LinkedIn URL', 'linkedin_url'],
                                ['Facebook URL', 'facebook_url'],
                                ['Instagram URL', 'instagram_url'],
                            ].map(([label, key]) => (
                                <label key={key} className="text-sm font-bold">
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
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Contact.layout = {
    breadcrumbs: [
        {
            title: 'Links & Contact',
            href: '/admin/contact',
        },
    ],
};
