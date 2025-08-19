"use client"

import { useCommand } from '@/providers/command-provider';
import React, { useEffect, useRef } from 'react'

type Props = {}

const ScrollIntoViewComponent = (props: Props) => {
    const { commandsHistory } = useCommand();

    useEffect(() => {
        const container = document.getElementById("cli-container");
        if (!container) return;

        const observer = new ResizeObserver(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });
        observer.observe(container);

        // Trigger once immediately in case no images are present
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

        return () => observer.disconnect();
    }, [commandsHistory]);

    // useEffect(() => {
    //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [commandsHistory]);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    return <div ref={bottomRef} />
}

export default ScrollIntoViewComponent