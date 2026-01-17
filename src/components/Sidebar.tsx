'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const menuLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const Sidebar = ({ isOpen, onClose }) => {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const panelRef = useRef(null);
    const tl = useRef(null);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    useGSAP(() => {
        gsap.set(panelRef.current, { x: '100%' });
        gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' });

        tl.current = gsap.timeline({ paused: true });

        tl.current!.to(overlayRef.current, {
            opacity: 1,
            pointerEvents: 'auto',
            duration: 0.3,
            ease: 'power2.inOut'
        }).to(panelRef.current, {
            x: '0%',
            duration: 0.8,
            ease: 'expo.out', // Very sleek, fast start, slow end
        }, "-=0.2").fromTo('.menu-link-item',
            { x: 50, opacity: 0, filter: 'blur(10px)' },
            {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                stagger: 0.1,
                duration: 0.5,
                ease: 'power2.out'
            },
            "-=0.6" // Start appearing while panel is still sliding
        );

    }, { scope: containerRef });

    // Handle Open/Close playback
    useEffect(() => {
        if (tl.current) {
            if (isOpen) {
                tl.current.play();
            } else {
                tl.current.reverse();
            }
        }
    }, [isOpen]);

    return (
        <div ref={containerRef} className="z-[60] relative">
            {/* Overlay Backdrop */}
            <div
                ref={overlayRef}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />

            {/* Sliding Panel */}
            <div
                ref={panelRef}
                className="fixed top-0 right-0 h-screen w-full md:w-[480px] bg-zinc-950 z-[61] shadow-2xl border-l border-white/10 flex flex-col justify-between p-8 md:p-12"
            >
                {/* Close Button Header */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={onClose}
                        className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <span className="uppercase text-xs tracking-widest group-hover:-translate-x-1 transition-transform">Close</span>
                        <div className="relative w-8 h-8 flex items-center justify-center border border-zinc-700 rounded-full group-hover:border-white transition-colors">
                            <span className="block absolute w-4 h-[1px] bg-current rotate-45"></span>
                            <span className="block absolute w-4 h-[1px] bg-current -rotate-45"></span>
                        </div>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-6">
                    {menuLinks.map((link, index) => (
                        <div key={index} className="overflow-hidden">
                            <Link
                                href={link.href}
                                onClick={onClose}
                                className="menu-link-item block text-5xl md:text-6xl font-bold text-zinc-300 hover:text-white transition-colors tracking-tighter"
                            >
                                {link.label}
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* Footer / Socials */}
                <div className="menu-link-item text-zinc-500 text-sm flex gap-6 uppercase tracking-widest mt-auto">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;