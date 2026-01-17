import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react"; // equivalent to using useEffect with cleanup

const RollingText = ({ text, className = "", height = "h-6" }) => {
    const containerRef = useRef(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    // Mouse Enter: Slide text up
    const handleMouseEnter = contextSafe(() => {
        gsap.to(".letter-wrapper", {
            y: "-100%",
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.0125, // Creates the wave effect
        });
    });

    // Mouse Leave: Slide text back down
    const handleMouseLeave = contextSafe(() => {
        gsap.to(".letter-wrapper", {
            y: "0%",
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.0125,
        });
    });

    return (
        <div
            ref={containerRef}
            className={`relative inline-block overflow-hidden cursor-pointer group ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={text} // Accessibility: Screen readers see the full text
        >
            {/* We create a wrapper for accessibility and structure */}
            <div className={`flex flex-row ${height} items-center`}>
                {text.split("").map((char, index) => (
                    // This span is the "Mask"
                    <span
                        key={index}
                        className="relative overflow-hidden font-bold uppercase"
                        style={{ width: char === " " ? "0.5em" : "auto" }} // Handle spaces
                    >
                        {/* This span moves inside the mask */}
                        <div className="letter-wrapper relative flex flex-col will-change-transform">
                            {/* Original Text */}
                            <span className="block leading-none">{char}</span>
                            {/* Duplicate Text (Absolute positioned below) */}
                            <span className="absolute top-full left-0 block leading-none">
                                {char}
                            </span>
                        </div>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default RollingText;