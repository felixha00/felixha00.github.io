import React, { useState } from "react";
import { motion } from "motion/react";

type RollingTextProps = {
    text: string;
    className?: string;
    height?: string;
};

const RollingText = ({ text, className = "", height = "h-6" }: RollingTextProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative inline-block overflow-hidden cursor-pointer group ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={text}
        >
            <div className={`flex flex-row ${height} items-center`}>
                {text.split("").map((char, index) => (
                    <span
                        key={index}
                        className="relative overflow-hidden font-bold uppercase"
                        style={{ width: char === " " ? "0.5em" : "auto" }}
                    >
                        <motion.div
                            className="letter-wrapper relative flex flex-col will-change-transform"
                            animate={{ y: isHovered ? "-100%" : "0%" }}
                            transition={{
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                                delay: index * 0.0125,
                            }}
                        >
                            <span className="block leading-none">{char}</span>
                            <span className="absolute top-full left-0 block leading-none">
                                {char}
                            </span>
                        </motion.div>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default RollingText;
