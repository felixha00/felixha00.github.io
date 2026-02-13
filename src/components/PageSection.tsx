
import { Heading, Inset, Separator } from '@radix-ui/themes';
import React from 'react'
import { MotionFade } from './animations/MotionFade';
import GridBackground from './fluff/GridBackground';
import { InfiniteSlider } from './motion-primitives/InfiniteSlider';

type Props = {
    title: string;
    children?: React.ReactNode;
    className?: string;
}

const PageSection = ({
    title,
    children,
    className = "",
}: Props) => {
    return (
        <MotionFade className={`${className}`}>
            <div className={`group flex flex-col border bg-background/50 relative p-4 hover-outline gap-4`}>
                <Heading className="bg-muted text-foreground text-2xl font-bold font-geist-pixel-line group-hover:font-geist-pixel-square w-fit p-1 px-3">{title}</Heading>
                <div className="absolute -z-1 top-0 bottom-0 right-0 left-0 overflow-hidden whitespace-nowrap transition-opacity opacity-100 will-change-contents group-hover:opacity-0 duration-500" style={{ containerType: "size", lineHeight: 1 }}>
                    <InfiniteSlider speed={24} gap={0}>
                        <h1 className="font-geist-pixel-line tracking-tighter font-bold uppercase text-[100cqh] text-muted">{title?.replaceAll(" ", "")}</h1>
                    </InfiniteSlider>
                </div>
                <GridBackground />
                {children}
            </div>
        </MotionFade>
    )
}

export default PageSection