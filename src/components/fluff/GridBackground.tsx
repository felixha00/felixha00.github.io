import React from 'react';

interface GridBackgroundProps {
    rows?: number;
    cols?: number;
    lineColor?: string;
    strokeWidth?: number;
    className?: string;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
    rows = 5,
    cols = 5,
    lineColor = 'stroke-muted/50', // Default color
    strokeWidth = 1,
    className = '',
}) => {
    return (
        <div
            className={`absolute inset-0 -z-10 pointer-events-none overflow-hidden ${className}`}
            aria-hidden="true"
        >
            <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <g className={lineColor} strokeWidth={strokeWidth} fill="none">

                    {/* 1. Vertical Lines (Columns) */}
                    {Array.from({ length: cols - 1 }).map((_, i) => (
                        <line
                            key={`col-${i}`}
                            x1={`${((i + 1) / cols) * 100}%`}
                            y1="0"
                            x2={`${((i + 1) / cols) * 100}%`}
                            y2="100%"
                        />
                    ))}

                    {/* 2. Horizontal Lines (Rows) */}
                    {Array.from({ length: rows - 1 }).map((_, i) => (
                        <line
                            key={`row-${i}`}
                            x1="0"
                            y1={`${((i + 1) / rows) * 100}%`}
                            x2="100%"
                            y2={`${((i + 1) / rows) * 100}%`}
                        />
                    ))}

                    {/* 3. Diagonal: Top-Left to Bottom-Right */}
                    <line x1="0" y1="0" x2="100%" y2="100%" />

                    {/* 4. Diagonal: Top-Right to Bottom-Left */}
                    <line x1="100%" y1="0" x2="0" y2="100%" />
                </g>
            </svg>
        </div>
    );
};

export default GridBackground;