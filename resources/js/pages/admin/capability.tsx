import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, LoaderCircle, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    AdminHero,
    FieldError,
    FormStatus,
    fieldClass,
    type PortfolioProfile,
    type Service,
    type SkillGroup,
} from './portfolio-shared';

type CapabilityProps = {
    profile: PortfolioProfile | null;
    skillGroups: SkillGroup[];
};

type CapabilityForm = {
    services: Service[];
    skill_groups: Array<{
        id: number | null;
        name: string;
        items_text: string;
    }>;
};

export default function Capability({ profile, skillGroups }: CapabilityProps) {
    const form = useForm<CapabilityForm>({
        services: profile?.services?.length
            ? profile.services
            : [{ title: '', body: '' }],
        skill_groups: skillGroups.length
            ? skillGroups.map((group) => ({
                  id: group.id,
                  name: group.name,
                  items_text: group.items.join(', '),
              }))
            : [{ id: null, name: '', items_text: '' }],
    });

    function errorFor(path: string) {
        return (form.errors as Record<string, string | undefined>)[path];
    }

    function submit(event: FormEvent) {
        event.preventDefault();
        form.patch('/admin/capability-map', {
            preserveScroll: true,
        });
    }

    function updateService(index: number, key: keyof Service, value: string) {
        form.setData(
            'services',
            form.data.services.map((service, serviceIndex) =>
                serviceIndex === index ? { ...service, [key]: value } : service,
            ),
        );
    }

    function updateSkillGroup(
        index: number,
        key: 'name' | 'items_text',
        value: string,
    ) {
        form.setData(
            'skill_groups',
            form.data.skill_groups.map((group, groupIndex) =>
                groupIndex === index ? { ...group, [key]: value } : group,
            ),
        );
    }

    return (
        <>
            <Head title="Capability Map Admin" />
            <div className="min-h-screen bg-neutral-50 p-4 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
                <div className="mx-auto grid max-w-7xl gap-6">
                    <AdminHero
                        eyebrow="Capability map"
                        title="Edit the interactive skills story."
                        body="These service cards and skill groups power the capability map on the public website."
                    />

                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
                    >
                        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-black tracking-[0.22em] text-neutral-500 uppercase">
                                        Interactive cards
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                        Service layers
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setData('services', [
                                            ...form.data.services,
                                            { title: '', body: '' },
                                        ])
                                    }
                                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-black"
                                >
                                    <Plus className="size-4" />
                                    Add
                                </button>
                            </div>

                            <div className="mt-6 grid gap-4">
                                {form.data.services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
                                                Card {index + 1}
                                            </p>
                                            {form.data.services.length > 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        form.setData(
                                                            'services',
                                                            form.data.services.filter(
                                                                (
                                                                    _service,
                                                                    serviceIndex,
                                                                ) =>
                                                                    serviceIndex !==
                                                                    index,
                                                            ),
                                                        )
                                                    }
                                                    className="text-red-600"
                                                    aria-label="Remove service"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            ) : null}
                                        </div>
                                        <label className="mt-3 block text-sm font-bold">
                                            Title
                                            <input
                                                className={fieldClass(
                                                    errorFor(
                                                        `services.${index}.title`,
                                                    ),
                                                )}
                                                value={service.title}
                                                onChange={(event) =>
                                                    updateService(
                                                        index,
                                                        'title',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <FieldError
                                                error={errorFor(
                                                    `services.${index}.title`,
                                                )}
                                            />
                                        </label>
                                        <label className="mt-3 block text-sm font-bold">
                                            Body
                                            <textarea
                                                className={fieldClass(
                                                    errorFor(
                                                        `services.${index}.body`,
                                                    ),
                                                )}
                                                rows={4}
                                                value={service.body}
                                                onChange={(event) =>
                                                    updateService(
                                                        index,
                                                        'body',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <FieldError
                                                error={errorFor(
                                                    `services.${index}.body`,
                                                )}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-black tracking-[0.22em] text-neutral-500 uppercase">
                                        Skills and icons
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                                        Skill groups
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setData('skill_groups', [
                                            ...form.data.skill_groups,
                                            {
                                                id: null,
                                                name: '',
                                                items_text: '',
                                            },
                                        ])
                                    }
                                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-black"
                                >
                                    <Plus className="size-4" />
                                    Add
                                </button>
                            </div>

                            <div className="mt-6 grid gap-4">
                                {form.data.skill_groups.map((group, index) => (
                                    <div
                                        key={`${group.id ?? 'new'}-${index}`}
                                        className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
                                                Group {index + 1}
                                            </p>
                                            {form.data.skill_groups.length >
                                            1 ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        form.setData(
                                                            'skill_groups',
                                                            form.data.skill_groups.filter(
                                                                (
                                                                    _group,
                                                                    groupIndex,
                                                                ) =>
                                                                    groupIndex !==
                                                                    index,
                                                            ),
                                                        )
                                                    }
                                                    className="text-red-600"
                                                    aria-label="Remove skill group"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            ) : null}
                                        </div>
                                        <label className="mt-3 block text-sm font-bold">
                                            Group name
                                            <input
                                                className={fieldClass(
                                                    errorFor(
                                                        `skill_groups.${index}.name`,
                                                    ),
                                                )}
                                                value={group.name}
                                                onChange={(event) =>
                                                    updateSkillGroup(
                                                        index,
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <FieldError
                                                error={errorFor(
                                                    `skill_groups.${index}.name`,
                                                )}
                                            />
                                        </label>
                                        <label className="mt-3 block text-sm font-bold">
                                            Items, comma-separated
                                            <textarea
                                                className={fieldClass(
                                                    errorFor(
                                                        `skill_groups.${index}.items_text`,
                                                    ),
                                                )}
                                                rows={3}
                                                value={group.items_text}
                                                onChange={(event) =>
                                                    updateSkillGroup(
                                                        index,
                                                        'items_text',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <FieldError
                                                error={errorFor(
                                                    `skill_groups.${index}.items_text`,
                                                )}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="lg:col-span-2">
                            <FormStatus
                                processing={form.processing}
                                progress={form.progress}
                                saved={form.recentlySuccessful}
                                label="Saving capability map..."
                            />
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
                            >
                                {form.processing
                                    ? 'Saving...'
                                    : 'Save capability map'}
                                {form.processing ? (
                                    <LoaderCircle className="size-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="size-4" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Capability.layout = {
    breadcrumbs: [
        {
            title: 'Capability Map',
            href: '/admin/capability-map',
        },
    ],
};
