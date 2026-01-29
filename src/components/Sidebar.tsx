import { Button } from '@radix-ui/themes'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { TbTopologyRing2 } from 'react-icons/tb'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { routes } from '@/config/routes'
import Link from 'next/link' // 1. Import Link
import { Triangle } from 'lucide-react'
import { SiVercel } from 'react-icons/si'
import Dither from '@/components/Dither'

const Sidebar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeLetter, setActiveLetter] = useState(routes[0].label[0]);

    const container = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // 2. Update ref type to Anchor element since we are using Links now
    const firstItemRef = useRef<HTMLAnchorElement>(null);

    const tl = useRef<gsap.core.Timeline>(null);

    useGSAP(() => {
        tl.current = gsap.timeline({ paused: true })
            .to(overlayRef.current, {
                display: 'block',
                opacity: 1,
                duration: 0.2,
                ease: "power3.inOut"
            })
            .to(sidebarRef.current, {
                display: 'flex',
                opacity: 1,
                duration: 0.2,
                ease: "power3.out",
            }, "-=0.1")
            .to('.sidebar-item', {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.3,
                stagger: 0.056,
                ease: "power2.out"
            }, "-=0.2");

        gsap.set(overlayRef.current, { opacity: 0, display: 'none' });
        gsap.set(sidebarRef.current, { opacity: 0, display: 'none' });
        gsap.set('.sidebar-item', {
            opacity: 0,
            filter: 'blur(10px)'
        });

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
            }, 100);
        } else {
            if (document.body.style.overflow === '') {
                triggerRef.current?.focus();
            }
        }
    }, [isOpen]);

    return (
        <div ref={container}>
            <Button
                ref={triggerRef}
                color='gray'
                highContrast
                radius='full'
                aria-expanded={isOpen}
                aria-controls="main-sidebar"
                aria-label={isOpen ? "Close Menu" : "Open Menu (Ctrl+M)"}
                className='group font-mono relative overflow-hidden z-100'
                onClick={toggleMenu}
            >
                {isOpen ? "CLOSE" : "MENU"}
                <SiVercel className={cn("size-3 transition-transform duration-300", isOpen ? "scale-y-[1]" : "scale-y-[-1]")} />
            </Button>

            <div
                ref={overlayRef}
                onClick={toggleMenu}
                aria-hidden="true"
                className="fixed inset-0 z-40 hidden bg-background"
            />

            <aside
                id="main-sidebar"
                ref={sidebarRef}
                role="dialog"
                aria-modal="true"
                className='fixed inset-0 z-50 hidden bg-background'
                style={{ containerType: "size" }}
            >
                <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
                    <div className='bg-muted hidden md:block' style={{ containerType: "size" }}>
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
                        {/* <h1 className='text-[150cqw] font-saint items-center flex flex-col'>
                            {activeLetter}
                        </h1> */}
                    </div>
                    <div className="flex flex-col justify-center items-center flex-1">
                        {routes.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                ref={index === 0 ? firstItemRef : null}
                                onClick={toggleMenu}
                                onMouseEnter={() => setActiveLetter(item.label[0])}
                                className='sidebar-item leading-none font-bold cursor-pointer text-muted-foreground hover:text-foreground focus:text-foreground outline-none transition-colors text-5xl'
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default Sidebar