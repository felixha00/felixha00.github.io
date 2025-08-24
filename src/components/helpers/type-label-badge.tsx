import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

const MotionBadge = motion.create(Badge);

type Props = {
    type: string;
};

// All configuration is centralized here
const typeLabels: Record<
    string,
    { label: string; colorClass: string }
> = {
    frontend: { label: "Frontend", colorClass: "bg-blue-500 text-white" },
    backend: { label: "Backend", colorClass: "bg-green-500 text-white" },
    design: { label: "design", colorClass: "bg-ansi-magenta text-white" },
    web: { label: "web", colorClass: "bg-ansi-cyan text-background" },
    research: { label: "Research", colorClass: "bg-yellow-500 text-black" },
};

const TypeLabelBadge: React.FC<Props> = ({ type }) => {
    const config = typeLabels[type];

    const label = config?.label ?? type;
    const colorClass = config?.colorClass ?? "bg-gray-400 text-white";

    return (
        <MotionBadge className={`${colorClass} font-mono shadow`}>
            {label}
        </MotionBadge>
    );
};

export default TypeLabelBadge;
