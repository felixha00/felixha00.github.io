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
    SiExpress,
    SiSvelte,
    SiPython,
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
    SiSupabase,
} from "react-icons/si";

const STACK_ICONS: Record<string, { icon: ReactNode; link: string; name: string }> = {
    "next-js": {
        icon: <SiNextdotjs className="dark:text-white text-black" />,
        link: "https://nextjs.org/",
        name: "Next.js",
    },
    react: {
        icon: <SiReact color="#61DAFB" />,
        link: "https://react.dev/",
        name: "React",
    },
    tailwind: {
        icon: <SiTailwindcss color="#06B6D4" />,
        link: "https://tailwindcss.com/",
        name: "Tailwind CSS",
    },
    typescript: {
        icon: <SiTypescript className="text-blue-600" />,
        link: "https://www.typescriptlang.org/",
        name: "TypeScript",
    },
    javascript: {
        icon: <SiJavascript className="text-yellow-400" />,
        link: "https://developer.mozilla.org/docs/Web/JavaScript",
        name: "JavaScript",
    },
    "node-js": {
        icon: <SiNodedotjs className="text-green-600" />,
        link: "https://nodejs.org/",
        name: "Node.js",
    },
    electron: {
        icon: <SiElectron color="#47848F" />,
        link: "https://www.electronjs.org/",
        name: "Electron",
    },

    blender: {
        icon: <SiBlender color="#F5792A" />,
        link: "https://www.blender.org/",
        name: "Blender",
    },
    photoshop: {
        icon: <SiAdobephotoshop color="#31A8FF" />,
        link: "https://www.adobe.com/products/photoshop.html",
        name: "Adobe Photoshop",
    },
    illustrator: {
        icon: <SiAdobeillustrator color="#FF9A00" />,
        link: "https://www.adobe.com/products/illustrator.html",
        name: "Adobe Illustrator",
    },
    rust: {
        icon: <SiRust color="#000000" />,
        link: "https://www.rust-lang.org/",
        name: "Rust",
    },
    cpp: {
        icon: <SiCplusplus color="#00599C" />,
        link: "https://isocpp.org/",
        name: "C++",
    },
    arduino: {
        icon: <SiArduino color="#00979D" />,
        link: "https://www.arduino.cc/",
        name: "Arduino",
    },
    express: {
        icon: <SiExpress className="dark:text-foreground" />,
        link: "https://expressjs.com/",
        name: "Express",
    },
    svelte: {
        icon: <SiSvelte color="#FF3E00" />,
        link: "https://svelte.dev/",
        name: "Svelte",
    },
    python: {
        icon: <SiPython className="dark:text-[#ffd43b] text-[#306998]" />,
        link: "https://www.python.org/",
        name: "Python",
    },

    docker: {
        icon: <SiDocker color="#2496ED" />,
        link: "https://www.docker.com/",
        name: "Docker",
    },
    kubernetes: {
        icon: <SiKubernetes color="#326CE5" />,
        link: "https://kubernetes.io/",
        name: "Kubernetes",
    },
    html5: {
        icon: <SiHtml5 color="#E34F26" />,
        link: "https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5",
        name: "HTML5",
    },
    css3: {
        icon: <SiCss3 color="#1572B6" />,
        link: "https://developer.mozilla.org/docs/Web/CSS",
        name: "CSS3",
    },
    git: {
        icon: <SiGit color="#F05032" />,
        link: "https://git-scm.com/",
        name: "Git",
    },
    github: {
        icon: <SiGithub color="#181717" />,
        link: "https://github.com/",
        name: "GitHub",
    },
    postgresql: {
        icon: <SiPostgresql color="#336791" />,
        link: "https://www.postgresql.org/",
        name: "PostgreSQL",
    },
    mysql: {
        icon: <SiMysql color="#4479A1" />,
        link: "https://www.mysql.com/",
        name: "MySQL",
    },
    graphql: {
        icon: <SiGraphql color="#E10098" />,
        link: "https://graphql.org/",
        name: "GraphQL",
    },
    aws: {
        icon: <SiAmazonwebservices color="#FF9900" />,
        link: "https://aws.amazon.com/",
        name: "AWS",
    },
    mongodb: {
        icon: <SiMongodb />,
        link: "https://www.mongodb.com/",
        name: "MongoDB",
    },
    firebase: {
        icon: <SiFirebase color="#DD2C00" />,
        link: "https://firebase.google.com/",
        name: "Firebase",
    },
    remix: {
        icon: <SiRemix color="text-foreground" />,
        link: "https://remix.run/",
        name: "Remix",
    },
    flutter: {
        icon: <SiFlutter color="#02569B" />,
        link: "https://flutter.dev/",
        name: "Flutter",
    },
    prisma: {
        icon: <SiPrisma color="text-foreground" />,
        link: "https://www.prisma.io/",
        name: "Prisma",
    },
    tauri: {
        icon: <SiTauri color="#24C8D8" />,
        link: "https://tauri.app/",
        name: "Tauri",
    },
    supabase: {
        icon: <SiSupabase />,
        link: "https://supabase.com/",
        name: "Supabase",
    },
};

export default STACK_ICONS;