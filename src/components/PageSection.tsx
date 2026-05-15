
import { Heading, Inset, Separator } from '@radix-ui/themes';
import React from 'react'
import { MotionFade } from './animations/MotionFade';
import GridBackground from './fluff/GridBackground';
import { InfiniteSlider } from './motion-primitives/InfiniteSlider';

type Props = {
    title: string;
    children?: React.ReactNode;
    className?: string;
    scrollingText?: string;
}

const PageSection = ({
    title,
    scrollingText = title,
    children,
    className = "",
}: Props) => {
    return (
        <MotionFade className={`${className}`}>
            <div className={`group h-full flex flex-col border relative opacity-95 hover:opacity-100 transition-opacity before:bg-background before:absolute before:inset-0 before:-z-1`}>
                <GridBackground />

                {/* <InfiniteSlider speed={24} gap={0}>
                    <h1 className="font-geist-pixel-line tracking-tighter font-bold uppercase text-2xl">{title} {title}</h1>
                </InfiniteSlider> */}
                <Heading className="border-l-4 group-hover:border-l-muted-foreground border-muted text-muted-foreground  transition-colors text-4xl font-bold font-geist-pixel-square group-hover:text-foreground w-fit px-8 mt-8">{title}</Heading>

                <div className="absolute -z-1 top-0 bottom-0 right-0 left-0 overflow-hidden whitespace-nowrap transition-opacity opacity-100 will-change-contents group-hover:opacity-0 duration-500" style={{ containerType: "size", lineHeight: 1 }}>
                    <InfiniteSlider speed={24} gap={0}>
                        <h1 className="font-geist-pixel-line tracking-tighter font-normal uppercase text-[100cqh] text-muted/20">{scrollingText?.replaceAll(" ", "")}</h1>
                    </InfiniteSlider>
                </div>

                {children}
            </div>
        </MotionFade>
    )
}

export default PageSection