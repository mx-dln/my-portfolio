import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Home, Radar } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const [seconds, setSeconds] = useState(6);

    useEffect(() => {
        const countdown = window.setInterval(() => {
            setSeconds((current) => Math.max(0, current - 1));
        }, 1000);
        const redirect = window.setTimeout(() => {
            window.location.href = '/';
        }, 6000);

        return () => {
            window.clearInterval(countdown);
            window.clearTimeout(redirect);
        };
    }, []);

    return (
        <>
            <Head title="Page Not Found" />
            <main className="grid min-h-screen place-items-center overflow-hidden bg-[#f8f9f6] px-5 py-10 text-[#151614]">
                <div className="pointer-events-none fixed inset-0 [background-image:linear-gradient(rgba(21,22,20,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(21,22,20,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
                <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(198,255,74,0.35),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(30,214,196,0.24),transparent_30%)]" />

                <section className="relative w-full max-w-3xl rounded-[2rem] border border-[#151614]/10 bg-white/82 p-8 shadow-[12px_12px_0_#151614] backdrop-blur-xl sm:p-12">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-black tracking-[0.28em] text-[#5a6257] uppercase">
                                404 / Route not found
                            </p>
                            <h1 className="mt-5 max-w-2xl text-5xl leading-[0.9] font-black tracking-[-0.06em] sm:text-7xl">
                                This page wandered off.
                            </h1>
                        </div>
                        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#c6ff4a] shadow-[5px_5px_0_#151614]">
                            <Radar className="size-7" />
                        </span>
                    </div>

                    <p className="mt-7 max-w-2xl text-lg leading-8 font-semibold text-[#4c544b]">
                        No worries. I am taking you back to the main portfolio
                        in{' '}
                        <span className="font-black text-[#151614]">
                            {seconds}
                        </span>{' '}
                        seconds.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#151614] px-6 py-4 text-sm font-black text-white shadow-[6px_6px_0_#c6ff4a] transition hover:-translate-y-0.5"
                        >
                            <Home className="size-4" />
                            Go home now
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
