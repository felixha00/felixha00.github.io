'use client';

import { cn } from '@/lib/utils';
import { useMeasure } from 'react-use';
import { Ref, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export type InfiniteSliderProps = {
    children: React.ReactNode;
    gap?: number;
    speed?: number; // pixels per second
    speedOnHover?: number; // pixels per second
    direction?: 'horizontal' | 'vertical';
    reverse?: boolean;
    className?: string;
};

export function InfiniteSlider({
    children,
    gap = 16,
    speed = 100,
    speedOnHover,
    direction = 'horizontal',
    reverse = false,
    className,
}: InfiniteSliderProps) {
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    const containerRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    useGSAP(() => {
        const size = direction === 'horizontal' ? width : height;
        if (!size) return;

        const distance = size / 2;
        const duration = distance / speed;

        const moveValue = reverse ? distance : -distance;

        tweenRef.current = gsap.fromTo(
            containerRef.current,
            {
                x: direction === 'horizontal' && reverse ? -distance : 0,
                y: direction === 'vertical' && reverse ? -distance : 0,
            },
            {
                x: direction === 'horizontal' ? moveValue : 0,
                y: direction === 'vertical' ? moveValue : 0,
                duration: duration,
                ease: 'none',
                repeat: -1,
                timeScale: isHovering && speedOnHover ? speedOnHover / speed : 1,
            }
        );
    }, {
        dependencies: [width, height, speed, direction, reverse],
        scope: containerRef
    });

    const handleHoverStart = () => {
        if (!speedOnHover || !tweenRef.current) return;
        setIsHovering(true);
        gsap.to(tweenRef.current, {
            timeScale: speedOnHover / speed,
            duration: 0.2,
            ease: 'power1.inOut'
        });
    };

    const handleHoverEnd = () => {
        if (!speedOnHover || !tweenRef.current) return;
        setIsHovering(false);
        gsap.to(tweenRef.current, {
            timeScale: 1,
            duration: 0.2,
            ease: 'power1.inOut'
        });
    };

    return (
        <div
            className={cn('overflow-hidden', className)}
            ref={ref}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
        >
            <div
                ref={containerRef}
                className="flex w-max"
                style={{
                    gap: `${gap}px`,
                    flexDirection: direction === 'horizontal' ? 'row' : 'column',
                }}
            >
                {children}
                {children}
            </div>
        </div>
    );
}