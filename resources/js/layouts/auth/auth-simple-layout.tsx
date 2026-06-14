import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-svh overflow-hidden bg-[#f8f9f6] text-[#151614]">
            <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(21,22,20,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(21,22,20,0.08)_1px,transparent_1px)] [background-size:64px_64px] opacity-45" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(198,255,74,0.28),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(30,214,196,0.2),transparent_26%),radial-gradient(circle_at_68%_86%,rgba(255,91,91,0.12),transparent_28%)]" />

            <div className="relative mx-auto grid min-h-svh max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                <section className="hidden lg:block">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-3"
                    >
                        <span className="grid size-13 place-items-center overflow-hidden rounded-full border border-[#151614] bg-white shadow-[6px_6px_0_#c6ff4a]">
                            <AppLogoIcon className="h-full w-full object-contain p-2" />
                        </span>
                        <span>
                            <span className="block text-sm font-black tracking-[0.18em] uppercase">
                                Michael De Leon
                            </span>
                            <span className="block text-xs font-semibold text-[#5c635b]">
                                Portfolio Studio
                            </span>
                        </span>
                    </Link>

                    <div className="mt-16 max-w-2xl">
                        <p className="text-sm font-black tracking-[0.28em] text-[#5a6257] uppercase">
                            Admin access
                        </p>
                        <h1 className="mt-5 text-6xl leading-[0.92] font-black tracking-[-0.06em]">
                            Keep the portfolio sharp before clients see it.
                        </h1>
                        <p className="mt-7 max-w-xl text-xl leading-8 text-[#3d433c]">
                            Update project stories, logos, capability signals,
                            and public profile details from one focused studio.
                        </p>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-md">
                    <div className="rounded-[1.75rem] border border-[#151614] bg-white/88 p-6 shadow-[10px_10px_0_#1ed6c4] backdrop-blur sm:p-8">
                        <div className="mb-8 flex flex-col items-center gap-4 text-center lg:hidden">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="grid size-14 place-items-center overflow-hidden rounded-full border border-[#151614] bg-white shadow-[5px_5px_0_#c6ff4a]">
                                    <AppLogoIcon className="h-full w-full object-contain p-2" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>
                        </div>

                        <div className="mb-7">
                            <p className="text-xs font-black tracking-[0.24em] text-[#5a6257] uppercase">
                                Secure login
                            </p>
                            <h2 className="mt-3 text-3xl leading-none font-black tracking-[-0.05em]">
                                {title}
                            </h2>
                            <p className="mt-3 text-sm leading-6 font-medium text-[#5c635b]">
                                {description}
                            </p>
                        </div>

                        {children}
                    </div>
                </section>
            </div>
        </div>
    );
}
