"use client";

import { PortableText } from "next-sanity";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, Box, Text } from "@radix-ui/themes";

interface ProjectContentTabsProps {
    sanityContent: any; // BlockContent type
    readmeContent: string | null;
}


export default function ProjectContentTabs({
    sanityContent,
    readmeContent,
}: ProjectContentTabsProps) {
    const defaultValue = sanityContent && sanityContent.length > 0 ? "details" : "readme";

    // if (!readmeContent && sanityContent) {
    //     return <PortableText value={sanityContent} />;
    // }

    // if (readmeContent && (!sanityContent || sanityContent.length === 0)) {
    //     return (
    //         <ReactMarkdown remarkPlugins={[remarkGfm]}>
    //             {readmeContent}
    //         </ReactMarkdown>
    //     );
    // }

    return (
        <Tabs.Root defaultValue={defaultValue}>
            <Tabs.List color="gray">
                {sanityContent &&
                    <Tabs.Trigger value="details">Project Details</Tabs.Trigger>
                }
                {readmeContent &&
                    <Tabs.Trigger value="readme">README.md</Tabs.Trigger>}
            </Tabs.List>

            <Box className="p-4">
                <Tabs.Content value="details">
                    {sanityContent && <PortableText value={sanityContent} />}
                </Tabs.Content>

                <Tabs.Content value="readme">
                    <div className="readme-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {readmeContent}
                        </ReactMarkdown>
                    </div>
                </Tabs.Content>
            </Box>
        </Tabs.Root>
    );
}