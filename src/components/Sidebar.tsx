import { Button, Flex, TextField, Text, Theme } from '@radix-ui/themes'
import React, { useRef, useState } from 'react'
import { LuX } from 'react-icons/lu'
import { TbTopologyRing2 } from 'react-icons/tb'
import { TextScramble } from './motion-primitives/TextScramble' // Assuming this path exists
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type Props = {}

const Sidebar = (props: Props) => {
    const [isHovered, setIsHovered] = useState(false);

    // Refs for GSAP targeting
    const container = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const tl = useRef<gsap.core.Timeline>(null);

    useGSAP(() => {
        tl.current = gsap.timeline({ paused: true })
            .to(overlayRef.current, {
                display: 'block',
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            })
            .to(sidebarRef.current, {
                x: '0%',

                duration: 0.5,
                ease: "power2.out",
            }, "-=0.3")
            .fromTo(".sidebar-item",
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.2)" },
                "-=0.3"
            );

        // Set initial state (hidden) without CSS quirks
        gsap.set(sidebarRef.current, { x: '100%' });
        gsap.set(overlayRef.current, { opacity: 0, display: 'none' });

    }, { scope: container });

    const toggleMenu = () => {
        if (tl.current?.isActive()) return; // Prevent spamming

        if (tl.current?.progress() === 0 || tl.current?.reversed()) {
            tl.current?.play();
        } else {
            tl.current?.reverse();
        }
    };

    return (
        <div ref={container}>
            {/* --- TRIGGER BUTTON --- */}
            <Button
                color='gray'
                highContrast
                radius='none'
                className='group font-mono relative overflow-hidden z-50'
                onClick={toggleMenu}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <TextScramble className='hidden md:block' duration={0.4} trigger={isHovered}>
                    MENU
                </TextScramble>
                <TbTopologyRing2 className="transition-transform duration-300 group-hover:-rotate-90" />
            </Button>

            {/* --- OVERLAY BACKDROP --- */}
            <div
                ref={overlayRef}
                onClick={toggleMenu}
                className="fixed inset-0 backdrop-blur-sm z-40 hidden"
            />

            {/* --- SIDEBAR ASIDE --- */}
            <aside
                ref={sidebarRef}
                className="fixed top-0 right-0 h-full w-full max-w-112.5 bg-background border border-border z-50 p-6 flex flex-col translate-x-full"
                style={{ willChange: 'transform' }} // Optimize for GPU
            >

                {/* Header */}
                <Flex justify="between" align="center" mb="6" className="sidebar-item">
                    <Flex direction="column">
                        <Text size="5" weight="bold">Edit profile</Text>
                        <Text size="2" color="gray">Make changes to your profile.</Text>
                    </Flex>
                    <Button
                        variant="ghost"
                        color="gray"
                        onClick={toggleMenu}
                        className="hover:bg-gray-100 rounded-full h-8 w-8 p-0"
                    >
                        <LuX size={20} />
                    </Button>
                </Flex>

                {/* Form Content */}
                <Flex direction="column" gap="5" className="flex-1">

                </Flex>

                {/* Footer Actions */}
                <Flex gap="3" mt="6" justify="end" className="sidebar-item pt-6 border-t border-gray-100">
                    <Button variant="soft" color="gray" onClick={toggleMenu}>
                        Cancel
                    </Button>
                    <Button onClick={toggleMenu} className="cursor-pointer">
                        Save Changes
                    </Button>
                </Flex>

            </aside>
        </div>
    )
}

export default Sidebar