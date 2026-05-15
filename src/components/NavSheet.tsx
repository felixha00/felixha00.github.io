'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';


const NAV_ITEMS = [
    { label: 'Home', href: '/', index: '01' },
    { label: 'Projects', href: '/projects', index: '02' },
    // { label: 'Blog', href: '/blog', index: '03' },
];

// CSS-only roll — zero React state on hover, runs on compositor thread
function RollChar({ char, delay }: { char: string; delay: number }) {
    const glyph = char === ' ' ? ' ' : char;
    const transition = {
        transitionProperty: 'transform',
        transitionDuration: '440ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
    };
    return (
        <span
            className="relative inline-block overflow-hidden"
            style={{ width: char === ' ' ? '0.4em' : undefined }}
        >
            {/* exits up on group hover */}
            <span
                className="block leading-none group-hover:-translate-y-full"
                style={transition}
            >
                {glyph}
            </span>
            {/* enters from below on group hover */}
            <span
                className="absolute top-full left-0 block leading-none group-hover:-translate-y-full"
                style={transition}
                aria-hidden
            >
                {glyph}
            </span>
        </span>
    );
}

function NavItemText({ text }: { text: string }) {
    return (
        <span className="flex" aria-label={text}>
            {text
                .toUpperCase()
                .split('')
                .map((char, i) => (
                    <RollChar key={i} char={char} delay={i * 22} />
                ))}
        </span>
    );
}

interface NavSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NavSheet({ open, onOpenChange }: NavSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button className='font-mono'>
                    MENU
                    <MenuIcon data-icon="inline-end" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[min(100vw,26rem)]"
            >
                {/* Header */}
                <SheetHeader>
                    <SheetTitle>NAVIGATION</SheetTitle>
                </SheetHeader>

                {/* Nav links — top-aligned */}
                <nav className="flex flex-col px-4 flex-1 gap-4">
                    {NAV_ITEMS.map((item, i) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.55,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.12 + i * 0.09,
                            }}
                        >
                            <Link
                                href={item.href}
                                onClick={() => onOpenChange(false)}
                                className="group flex items-center justify-between"
                            >
                                <span
                                    className="font-display text-6xl leading-none"
                                >
                                    <NavItemText text={item.label} />
                                </span>
                                {/* <span
                                    className="font-mono text-xs tabular-nums shrink-0 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-65 group-hover:-translate-x-1.5 text-muted-foreground"
                                >
                                    {item.index}
                                </span> */}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                <SheetFooter>
                    <p>
                        Felix Ha — 2025
                    </p>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
