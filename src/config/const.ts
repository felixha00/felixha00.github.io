import { CodeSquare, Globe2, Pointer, ScanEye } from "lucide-react";

export const MAIN_CATEGORIES = [
    {
        slug: "sfw",
        title: "Software & Web",
        icon: CodeSquare,
        theme: "blue" as const
    },
    {
        slug: "hdw",
        title: "Hardware & Tangibles",
        icon: Pointer,
        theme: "red" as const
    },
    {
        slug: "viz",
        title: "Visuals & Branding",
        icon: ScanEye,
        theme: "green" as const
    },
    {
        slug: "biz",
        title: "Business & Ventures",
        icon: Globe2,
        theme: "gold" as const
    },
];

export const getCategoryTitle = (value: string) => {
    const category = MAIN_CATEGORIES.find(c => c.slug === value);
    return category ? category.title : value;
}