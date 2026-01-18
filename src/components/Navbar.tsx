'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import RollingText from './RollingText';
import { TextRoll } from './motion-primitives/TextRoll';
import { Button } from '@radix-ui/themes';
import { TbMenu2 } from "react-icons/tb";
import { LuMenu } from "react-icons/lu";
import { TextScramble } from './motion-primitives/TextScramble';
import Sidebar from './Sidebar';
import { Clock } from './Clock';
gsap.registerPlugin(useGSAP);

const Navbar = () => {
    const containerRef = useRef(null);
    const nameRef = useRef(null);
    const logoRef = useRef(null);
    const [showLogo, setShowLogo] = useState(false);

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

    useGSAP(() => {
        const tl = gsap.timeline();
        const duration = 0.4;
        const ease = "power2.out";

        if (showLogo) {
            // Animate Name OUT
            tl.to(nameRef.current, {
                y: -15, // Move UP
                autoAlpha: 0,
                filter: 'blur(10px)',
                duration: duration,
                ease: ease,
            })
                // Animate Logo IN
                .fromTo(logoRef.current,
                    { y: 15, autoAlpha: 0, filter: 'blur(10px)' }, // Start from DOWN
                    { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: duration, ease: ease },
                    "<"
                );
        } else {
            // Animate Logo OUT
            tl.to(logoRef.current, {
                y: -15,
                autoAlpha: 0,
                filter: 'blur(8px)',
                duration: duration,
                ease: ease,
            })
                // Animate Name IN
                .fromTo(nameRef.current,
                    { y: 15, autoAlpha: 0, filter: 'blur(8px)' },
                    { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: duration, ease: ease },
                    "<"
                );
        }
    }, { scope: containerRef, dependencies: [showLogo] });

    return (
        <nav className='z-50 fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-linear-to-b from-background to-100% to-transparent'>
            <div ref={containerRef} className='grid grid-cols-1 grid-rows-1 items-center'>

                {/* Name */}
                <h1
                    ref={nameRef}
                    className='col-start-1 row-start-1 text-2xl font-bold opacity-100 tracking-tight -translate-y-1'
                >
                    felix ha
                </h1>

                {/* Logo */}
                <div
                    ref={logoRef}
                    className='col-start-1 row-start-1 opacity-0 relative'
                >
                    {/* <div className='-top-10 -left-8 bg-radial from-background to-transparent to-70% absolute size-24'></div> */}
                    <Image
                        src="/logo-white.svg"
                        alt="Logo"
                        width={40}
                        height={40}
                        priority
                    // className="mix-blend-difference"
                    />

                </div>
            </div>
            <Sidebar />
            <div className='bg-white/10 h-11 p-4 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl flex justify-center flex-row font-mono'><Clock /></div>
        </nav>
    );
}

export default Navbar;