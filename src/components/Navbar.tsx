'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { Button, DropdownMenu } from '@radix-ui/themes';

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
            tl.to(nameRef.current, {
                y: -15,
                autoAlpha: 0,
                filter: 'blur(10px)',
                duration: duration,
                ease: ease,
            })
                .fromTo(logoRef.current,
                    { y: 15, autoAlpha: 0, filter: 'blur(10px)' },
                    { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: duration, ease: ease },
                    "<"
                );
        } else {
            tl.to(logoRef.current, {
                y: -15,
                autoAlpha: 0,
                filter: 'blur(8px)',
                duration: duration,
                ease: ease,
            })
                .fromTo(nameRef.current,
                    { y: 15, autoAlpha: 0, filter: 'blur(8px)' },
                    { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: duration, ease: ease },
                    "<"
                );
        }
    }, { scope: containerRef, dependencies: [showLogo] });

    return (
        <nav className='z-50 h-16 fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-linear-to-b from-background to-100% to-transparent'>
            <div ref={containerRef} className='grid grid-cols-1 grid-rows-1 items-center z-100 mix-blend-difference'>
                {/* Name */}

                <h1
                    ref={nameRef}
                    className='col-start-1 row-start-1 text-2xl font-bold opacity-100 tracking-tight -translate-y-1 mix-blend-difference text-white'
                >
                    <Link href={"/"}>
                        felix ha
                    </Link>
                </h1>

                {/* Logo */}
                <div
                    ref={logoRef}
                    className='col-start-1 row-start-1 opacity-0 relative'
                >
                    <Link href={"/"}>
                        <Image
                            src="/logo-white.svg"
                            alt="Logo"
                            width={40}
                            height={40}
                            priority
                        />
                    </Link>
                </div>
            </div>

            <DropdownMenu.Root >
                <DropdownMenu.Trigger>
                    <Button highContrast color="gray" size="2" className='font-mono'>
                        MENU
                        <DropdownMenu.TriggerIcon />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align='end' sideOffset={16} color="gray" highContrast className='[&_.rt-DropdownMenuItem]:content-between'>
                    <Link href="/">
                        <DropdownMenu.Item shortcut='🏠'>
                            Home
                        </DropdownMenu.Item>
                    </Link>
                    <Link href="/projects">
                        <DropdownMenu.Item shortcut='🚧'>
                            Projects
                        </DropdownMenu.Item>
                    </Link>
                    {/* <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
                    <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
                        <DropdownMenu.SubContent>
                            <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
                            <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
                        </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>

                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>Share</DropdownMenu.Item>
                    <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                        Delete
                    </DropdownMenu.Item> */}
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* <Sidebar /> */}
            {/* <div className='bg-white/10 h-11 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl flex justify-center flex-row font-mono px-4 backdrop-blur-lg text-sm items-center gap-2'>YYZ<Globe className='size-3' /><Clock /></div> */}
        </nav >
    );
}

export default Navbar;