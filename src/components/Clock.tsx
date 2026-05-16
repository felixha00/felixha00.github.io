'use client';
import { useEffect, useState } from 'react';
import { SlidingNumber } from './motion-primitives/SlidingNumber';

export function Clock() {
    // 1. Initialize with null or 0 to avoid server/client mismatch (Hydration error)
    const [time, setTime] = useState<{ h: number; m: number; s: number } | null>(null);

    // This defines the timezone you want to show
    // 'America/New_York' covers EST/EDT automatically
    const targetTimeZone = process.env.NEXT_PUBLIC_MY_TIMEZONE || 'America/New_York';

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // Convert current time to the target timezone
            const options: Intl.DateTimeFormatOptions = {
                timeZone: targetTimeZone,
                hour12: false, // 24h format to match your original getHours()
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            };

            // Get the time string in the target zone (e.g., "14:05:30")
            const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
            const [h, m, s] = timeString.split(':').map(Number);

            setTime({ h, m, s });
        };

        // Run immediately on mount
        updateTime();

        // Set interval
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [targetTimeZone]);

    // Prevent rendering until the client has calculated the correct time
    if (!time) return <div className="flex gap-0.5 font-sans text-transparent">00:00:00</div>;

    return (
        <div className='flex items-center gap-0 font-display'>
            <SlidingNumber value={time.h} padStart={true} />
            <span className='text-muted-foreground'>:</span>
            <SlidingNumber value={time.m} padStart={true} />
            <span className='text-muted-foreground'>:</span>
            <SlidingNumber value={time.s} padStart={true} />
        </div>
    );
}
