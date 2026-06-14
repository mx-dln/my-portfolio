import type { ComponentProps } from 'react';

export default function AppLogoIcon({
    alt = 'Michael De Leon logo',
    className,
    ...props
}: ComponentProps<'img'>) {
    return (
        <img
            src="/assets/image/md-no-bg.png"
            alt={alt}
            className={className}
            draggable={false}
            {...props}
        />
    );
}
