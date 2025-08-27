import { ReactNode } from "react";
import {
    SiElectron,
    SiJavascript,
    SiNextdotjs,
    SiNodedotjs,
    SiReact,
    SiTailwindcss,
    SiTypescript,
    SiBlender,
    SiAdobephotoshop,
    SiAdobeillustrator,
    SiRust,
    SiCplusplus,
    SiArduino,
    // SiFusion360,
    SiExpress,
    SiSvelte,
    SiPython,
    // SiJava,
    SiDocker,
    SiKubernetes,
    SiHtml5,
    SiCss3,
    SiGit,
    SiGithub,
    SiPostgresql,
    SiMysql,
    SiGraphql,
    SiAmazonwebservices,
    SiMongodb,
    SiFirebase,
    SiRemix,
    SiFlutter,
    SiPrisma,
    SiTauri,
    SiSupabase
    // SiAzure
} from "react-icons/si";

const STACK_ICONS: Record<string, { icon: ReactNode }> = {
    "next-js": { icon: <SiNextdotjs className="dark:text-white text-black" /> },
    "react": { icon: <SiReact color="#61DAFB" /> },
    "tailwind": { icon: <SiTailwindcss color="#06B6D4" /> },
    "typescript": { icon: <SiTypescript className="text-blue-600" /> },
    "javascript": { icon: <SiJavascript className="text-yellow-400" /> },
    "node-js": { icon: <SiNodedotjs className="text-green-600" /> },
    "electron": { icon: <SiElectron color="#47848F" /> },

    // Added icons with official or accepted brand colors
    "blender": { icon: <SiBlender color="#F5792A" /> },             // Blender orange
    "photoshop": { icon: <SiAdobephotoshop color="#31A8FF" /> },    // Photoshop blue
    "illustrator": { icon: <SiAdobeillustrator color="#FF9A00" /> },// Illustrator orange
    "rust": { icon: <SiRust color="#000000" /> },                   // Rust black
    "cpp": { icon: <SiCplusplus color="#00599C" /> },       // C++ blue
    "arduino": { icon: <SiArduino color="#00979D" /> },             // Arduino teal
    // "fusion360": { icon: <SiFusion360 color="#F25022" /> },         // Fusion 360 orange
    "express": { icon: <SiExpress className="dark:text-foreground" /> },             // Express black
    "svelte": { icon: <SiSvelte color="#FF3E00" /> },                // Svelte red-orange
    "python": {
        icon: <SiPython className="dark:text-[#ffd43b] text-[#306998]" />
    },                                                               // Python yellow/light, blue/dark based on theme
    // "java": { icon: <SiJava color="#007396" /> },                    // Java blue
    // Bonus "common" stacks
    "docker": { icon: <SiDocker color="#2496ED" /> },
    "kubernetes": { icon: <SiKubernetes color="#326CE5" /> },
    "html5": { icon: <SiHtml5 color="#E34F26" /> },
    "css3": { icon: <SiCss3 color="#1572B6" /> },
    "git": { icon: <SiGit color="#F05032" /> },
    "github": { icon: <SiGithub color="#181717" /> },
    "postgresql": { icon: <SiPostgresql color="#336791" /> },
    "mysql": { icon: <SiMysql color="#4479A1" /> },
    "graphql": { icon: <SiGraphql color="#E10098" /> },
    "aws": { icon: <SiAmazonwebservices color="#FF9900" /> },
    "mongodb": {
        icon: <SiMongodb />
    },
    "firebase": {
        icon: <SiFirebase color="#DD2C00" />
    },
    "remix": {
        icon: <SiRemix color="text-foreground" />
    },
    "flutter": {
        icon: <SiFlutter color="#02569B" />
    },
    "prisma": {
        icon: <SiPrisma color="text-foreground" />
    },
    "tauri": {
        icon: <SiTauri color="#24C8D8" />
    },
    "supabase": {
        icon: <SiSupabase />
    }
    // "azure": { icon: <SiAzure color="#0089D6" /> },
};

export default STACK_ICONS;
