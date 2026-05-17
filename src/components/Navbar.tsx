'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { NavSheet } from '@/components/NavSheet';

const Navbar = () => {
    const containerRef = useRef(null);
    const [showLogo, setShowLogo] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleUpdate = () => {
            const isScrolled = window.scrollY > 42;
            const isMobile = window.innerWidth < 768;
            setShowLogo(isScrolled || isMobile);
        };

        handleUpdate();
        window.addEventListener('scroll', handleUpdate);
        window.addEventListener('resize', handleUpdate);
        return () => {
            window.removeEventListener('scroll', handleUpdate);
            window.removeEventListener('resize', handleUpdate);
        };
    }, []);

    return (
        <nav className='z-50 h-16 fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-linear-to-b from-background to-100% to-transparent'>
            <div ref={containerRef} className='grid grid-cols-1 grid-rows-1 items-center z-100 mix-blend-difference'>
                {/* Name */}

                <motion.h1
                    animate={{
                        y: showLogo ? -15 : 0,
                        opacity: showLogo ? 0 : 1,
                        filter: showLogo ? 'blur(10px)' : 'blur(0px)',
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`col-start-1 row-start-1 w-fit text-2xl font-extrabold opacity-100 tracking-tighter -translate-y-1 mix-blend-difference text-white font-display ${showLogo ? 'pointer-events-none' : 'pointer-events-auto'}`}
                >
                    <Link href={"/"} className='inline-flex'>
                        felix ha
                    </Link>
                </motion.h1>

                {/* Logo */}
                <motion.div
                    animate={{
                        y: showLogo ? 0 : -15,
                        opacity: showLogo ? 1 : 0,
                        filter: showLogo ? 'blur(0px)' : 'blur(8px)',
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`col-start-1 row-start-1 justify-self-start w-fit opacity-0 relative ${showLogo ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                    <Link href={"/"} className='inline-flex size-10 items-center'>
                        <Image
                            src="/logo-white.svg"
                            alt="Logo"
                            width={40}
                            height={40}
                            priority
                        />
                    </Link>
                </motion.div>
            </div>

            <NavSheet open={menuOpen} onOpenChange={setMenuOpen} />

            {/* <Sidebar /> */}
            {/* <div className='bg-white/10 h-11 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl flex justify-center flex-row font-sans px-4 backdrop-blur-lg text-sm items-center gap-2'>YYZ<Globe className='size-3' /><Clock /></div> */}
        </nav >
    );
}

export default Navbar;
