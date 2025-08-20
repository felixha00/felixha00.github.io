import ProjectsGallery, { ProjectItem } from "@/components/projects-gallery";

const DemoProjectsPage = () => {
    const demo: ProjectItem[] = [
        {
            slug: "nextjs-site",
            title: "Marketing site redesign",
            description:
                "A responsive marketing site built with Next.js App Router, MDX, and ISR.",
            date: "2025-04-12",
            type: "web",
            image: "/images/demo/marketing.jpg",
        },
        {
            slug: "ml-vision-tool",
            title: "Vision labeling tool",
            description:
                "Built an interactive labeling tool with WebGL canvas, hooks, and keyboard UX.",
            date: "2024-11-28",
            type: "ml",
            image: "/images/demo/label.jpg",
        },
        {
            slug: "design-system",
            title: "Design system",
            description:
                "Token-driven design system with Tailwind, Radix primitives, and Storybook.",
            date: "2023-09-10",
            type: "design",
            image: "/images/demo/design.jpg",
        },
        {
            slug: "data-viz",
            title: "Realtime analytics dashboard",
            description:
                "Websocket-powered dashboard visualizing metrics with custom charts.",
            date: "2025-01-03",
            type: "web",
            image: "/images/demo/dash.jpg",
        },
    ];
    return <ProjectsGallery items={demo} baseRoute="/projects" />;
};

export default DemoProjectsPage