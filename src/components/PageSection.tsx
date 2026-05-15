import React from "react";
import { MotionFade } from "./animations/MotionFade";
import GridBackground from "./fluff/GridBackground";
import { InfiniteSlider } from "./motion-primitives/InfiniteSlider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
    title: string;
    children?: React.ReactNode;
    className?: string;
    scrollingText?: string;
};

const PageSection = ({
    title,
    scrollingText = title,
    children,
    className = "",
}: Props) => {
    return (
        <MotionFade className={cn("h-full", className)}>
            <Card className="group relative h-full opacity-95 transition-opacity hover:opacity-100 bg-background/80 hover:border-muted-foreground">
                <GridBackground />

                <CardHeader className="relative border-l-4 group-hover:border-l-muted-foreground rounded-none">
                    <CardTitle className="w-fit font-display text-4xl font-normal text-muted-foreground transition-colors group-hover:text-foreground">
                        {title}
                    </CardTitle>
                </CardHeader>

                <div
                    className="absolute inset-0 -z-1 overflow-hidden whitespace-nowrap opacity-100 transition-opacity duration-500 group-hover:opacity-0"
                    style={{ containerType: "size", lineHeight: 1 }}
                >
                    <InfiniteSlider speed={24} gap={0}>
                        <h1 className="font-display text-[100cqh] font-normal uppercase tracking-tighter text-muted/20">
                            {scrollingText?.replaceAll(" ", "")}
                        </h1>
                    </InfiniteSlider>
                </div>

                <CardContent className="relative flex h-full flex-col">
                    {children}
                </CardContent>
            </Card>
        </MotionFade>
    );
};

export default PageSection;
