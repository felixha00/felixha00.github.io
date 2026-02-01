// TODO: better animate the links for text changing

import { Button } from '@radix-ui/themes'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { TbTopologyRing2 } from 'react-icons/tb'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { routes } from '@/config/routes'
import Link from 'next/link'
import { Triangle } from 'lucide-react'
import { SiVercel } from 'react-icons/si'
import Dither from '@/components/Dither'
import GridBackground from './fluff/GridBackground'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Removed unused state: activeLetter (unless you plan to use it for the TODO later)
    const [, setActiveLetter] = useState(routes[0].label[0]);

    const container = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const firstItemRef = useRef<HTMLAnchorElement>(null);
    const leftSideRef = useRef<HTMLDivElement>(null);

    const tl = useRef<gsap.core.Timeline>(null);

    useGSAP(() => {
        // 1. Set Initial States
        gsap.set(sidebarRef.current, {
            yPercent: -100, // Start fully off-screen (top)
            display: 'none'
        });

        gsap.set(leftSideRef.current, {
            opacity: 0,
        });

        gsap.set('.sidebar-item', {
            opacity: 0,
            y: 50, // Push items down slightly so they slide UP into view
            filter: 'blur(10px)'
        });

        // 2. Build Timeline
        tl.current = gsap.timeline({ paused: true })
            .to(sidebarRef.current, {
                display: 'flex',
                yPercent: 0, // Slide down to natural position
                duration: 0.6, // Slightly longer for a full-screen slide
                ease: "power2.inOut", // "Premium" heavy ease
            })
            .to(leftSideRef.current, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            }, "-=0.2")
            .to('.sidebar-item', {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.4,
                stagger: 0.1, // Stagger the text reveal
                ease: "power2.out"
            }, "-=0.4");

    }, { scope: container });

    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => {
            if (!prev) {
                tl.current?.play();
                document.body.style.overflow = 'hidden';
                setActiveLetter(routes[0].label[0]);
            } else {
                tl.current?.reverse();
                document.body.style.overflow = '';
            }
            return !prev;
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isOpen && e.key === 'Escape') {
                toggleMenu();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
                e.preventDefault();
                toggleMenu();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, toggleMenu]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                firstItemRef.current?.focus();
            }, 500); // Increased delay slightly to match animation duration
        } else {
            if (document.body.style.overflow === '') {
                triggerRef.current?.focus();
            }
        }
    }, [isOpen]);

    return (
        <div ref={container}>
            {/* Added z-index 101 to ensure button stays above the sliding sidebar (z-50) */}
            <Button
                ref={triggerRef}
                color='gray'
                highContrast
                radius='full'
                aria-expanded={isOpen}
                aria-controls="main-sidebar"
                aria-label={isOpen ? "Close Menu" : "Open Menu (Ctrl+M)"}
                className='group font-mono relative overflow-hidden z-[101]'
                onClick={toggleMenu}
            >
                {isOpen ? "CLOSE" : "MENU"}
                <SiVercel className={cn("size-3 transition-transform duration-300", isOpen ? "scale-y-[1]" : "scale-y-[-1]")} />
            </Button>

            <aside
                id="main-sidebar"
                ref={sidebarRef}
                role="dialog"
                aria-modal="true"
                // Added 'will-change-transform' for smoother animation performance
                className='fixed inset-0 z-50 hidden bg-background border border-border will-change-transform'
                style={{ containerType: "size" }}
            >
                <div className='grid grid-cols-1 md:grid-cols-2 w-full h-full'>
                    <div ref={leftSideRef} className='bg-muted relative hidden md:block overflow-hidden' style={{ containerType: "size" }}>
                        <Dither
                            waveColor={[0.5, 0.5, 0.5]}
                            disableAnimation={false}
                            enableMouseInteraction
                            mouseRadius={0.3}
                            colorNum={4}
                            waveAmplitude={0.3}
                            waveFrequency={3}
                            waveSpeed={0.05}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center flex-1 relative h-full">
                        {routes.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                ref={index === 0 ? firstItemRef : null}
                                onClick={toggleMenu}
                                onMouseEnter={() => setActiveLetter(item.label[0])}
                                className='sidebar-item leading-none cursor-pointer text-muted-foreground hover:text-foreground focus:text-foreground outline-none transition-colors py-1'
                            >
                                <h1 className='font-redaction-20 hover:font-redaction text-5xl'>{item.label}</h1>
                            </Link>
                        ))}
                        <GridBackground rows={6} />
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default Sidebar