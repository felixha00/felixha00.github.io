// TODO: better animate the links for text changing

import { Button } from '@/components/ui/button'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { routes } from '@/config/routes'
import Link from 'next/link'
import { SiVercel } from 'react-icons/si'
import Dither from '@/components/Dither'
import GridBackground from './fluff/GridBackground'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const container = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const firstItemRef = useRef<HTMLAnchorElement>(null);
    const leftSideRef = useRef<HTMLDivElement>(null);

    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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
                aria-expanded={isOpen}
                aria-controls="main-sidebar"
                aria-label={isOpen ? "Close Menu" : "Open Menu (Ctrl+M)"}
                className='group relative z-[101] overflow-hidden rounded-full font-sans'
                onClick={toggleMenu}
            >
                {isOpen ? "CLOSE" : "MENU"}
                <SiVercel data-icon="inline-end" className={cn("transition-transform duration-300", isOpen ? "scale-y-[1]" : "scale-y-[-1]")} />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        id="main-sidebar"
                        ref={sidebarRef}
                        role="dialog"
                        aria-modal="true"
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className='fixed inset-0 z-50 flex bg-background border border-border will-change-transform'
                        style={{ containerType: "size" }}
                    >
                        <div className='grid grid-cols-1 md:grid-cols-2 w-full h-full'>
                            <motion.div
                                ref={leftSideRef}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                                className='bg-muted relative hidden md:block overflow-hidden'
                                style={{ containerType: "size" }}
                            >
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
                            </motion.div>
                            <div className="flex flex-col justify-center items-center flex-1 relative h-full">
                                {routes.map((item, index) => (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                                        transition={{
                                            duration: 0.4,
                                            delay: 0.2 + index * 0.1,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                    >
                                        <Link
                                            href={item.path}
                                            ref={index === 0 ? firstItemRef : null}
                                            onClick={toggleMenu}
                                            className='sidebar-item leading-none cursor-pointer text-muted-foreground hover:text-foreground focus:text-foreground outline-none transition-colors py-1'
                                        >
                                            <h1 className='font-heading hover:font-display font-bold text-5xl'>{item.label}</h1>
                                        </Link>
                                    </motion.div>
                                ))}
                                <GridBackground rows={6} />
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Sidebar
