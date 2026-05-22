"use client";

import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectContentTabsProps {
    sanityContent?: PortableTextBlock[] | null;
    readmeContent: string | null;
}

export default function ProjectContentTabs({
    sanityContent,
    readmeContent,
}: ProjectContentTabsProps) {
    const hasSanity = Boolean(sanityContent && sanityContent.length > 0);
    const hasReadme = Boolean(readmeContent);

    if (hasSanity && !hasReadme) {
        return <PortableText value={sanityContent!} />;
    }

    if (hasReadme && !hasSanity) {
        return (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {readmeContent}
            </ReactMarkdown>
        );
    }

    return (
        <Tabs defaultValue="details">
            <TabsList>
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="readme">README.md</TabsTrigger>
            </TabsList>
            <div className="p-4">
                <TabsContent value="details">
                    <PortableText value={sanityContent!} />
                </TabsContent>
                <TabsContent value="readme">
                    <div className="readme-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {readmeContent}
                        </ReactMarkdown>
                    </div>
                </TabsContent>
            </div>
        </Tabs>
    );
}
