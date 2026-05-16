'use client';

import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { cn } from '@/lib/utils';


const NAV_ITEMS = [
    { label: 'Home', href: '/', index: '01' },
    { label: 'Projects', href: '/projects', index: '02' },
    // { label: 'Blog', href: '/blog', index: '03' },
];


function NavItemText({ text, active }: { text: string; active: boolean }) {
    return (
        <span
            className={cn(
                "flex uppercase transition-colors",
                active
                    ? "text-background"
                    : "text-muted-foreground group-hover:text-foreground"
            )}
            aria-label={text}
        >
            {text}
        </span>
    );
}

function isActivePath(pathname: string, href: string) {
    if (href === '/') {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NavSheet({ open, onOpenChange }: NavSheetProps) {
    const lenis = useLenis();
    const pathname = usePathname();

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        lenis?.stop();
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
            lenis?.start();
        };
    }, [lenis, open]);

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
                <nav className="flex flex-col flex-1">
                    {NAV_ITEMS.map((item, i) => {
                        const active = isActivePath(pathname, item.href);

                        return (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.55,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: 0.12 + i * 0.09,
                                }}
                                className={cn(
                                    'group px-4 py-2 transition-colors',
                                    active
                                        ? 'bg-foreground'
                                        : 'hover:bg-muted'
                                )}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => onOpenChange(false)}
                                    className="group flex items-center justify-between"
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <span
                                        className="font-display text-6xl leading-none transition-colors"
                                    >
                                        <NavItemText text={item.label} active={active} />
                                    </span>
                                    {/* <span
                                    className="font-mono text-xs tabular-nums shrink-0 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-65 group-hover:-translate-x-1.5 text-muted-foreground"
                                >
                                    {item.index}
                                </span> */}
                                </Link>
                            </motion.div>
                        );
                    })}
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
