import React from "react";
import { MotionFade } from "./animations/MotionFade";
import GridBackground from "./fluff/GridBackground";
import { InfiniteSlider } from "./motion-primitives/InfiniteSlider";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
    title: string;
    children?: React.ReactNode;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    scrollingText?: string;
};

const InfoCard = ({
    title,
    scrollingText = title,
    children,
    action,
    footer,
    className = "",
}: Props) => {
    return (
        <MotionFade className={cn("h-full", className)}>
            <Card className="group relative h-full bg-card/20 hover:ring-muted-foreground transition-all pb-0 md:pb-4!">
                <GridBackground />

                <CardHeader className="relative border-l-4 group-hover:border-l-muted-foreground rounded-none transition-colors">
                    <CardTitle className="w-fit font-display text-2xl font-normal text-muted-foreground transition-colors group-hover:text-foreground">
                        {title}
                    </CardTitle>
                    {action ? (
                        <CardAction>
                            {action}
                        </CardAction>
                    ) : null}
                </CardHeader>
                {/* 
                <div
                    className="absolute inset-0 -z-1 overflow-hidden whitespace-nowrap opacity-100 transition-opacity duration-1000 group-hover:opacity-0"
                    style={{ containerType: "size", lineHeight: 1 }}
                >
                    <InfiniteSlider speed={24} gap={0}>
                        <h1 className="font-display text-[100cqh] font-normal uppercase tracking-tighter text-muted/20">
                            {scrollingText?.replaceAll(" ", "")}
                        </h1>
                    </InfiniteSlider>
                </div> */}

                <CardContent className="relative flex h-full flex-col px-0 md:px-4">
                    {children}
                </CardContent>

                {footer ? (
                    <CardFooter className="relative pb-0">
                        {footer}
                    </CardFooter>
                ) : null}
            </Card>
        </MotionFade>
    );
};

export default InfoCard;
