import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center overflow-hidden rounded-xl border border-sidebar-border bg-white shadow-sm">
                <AppLogoIcon className="h-full w-full object-contain p-1" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Michael De Leon
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Portfolio Studio
                </span>
            </div>
        </>
    );
}
