<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import type { Icon } from "@tabler/icons-svelte";
    import {
        IconBriefcase,
        IconHome,
        IconSettings,
        IconUser,
        IconHammer,
        IconCopy,
    } from "@tabler/icons-svelte";

    type Props = {
        title: string;
    };

    let { title }: Props = $props();

    // Mapping of titles to icon components
    const iconMap: Record<string, typeof IconBriefcase> = {
        experience: IconBriefcase,
        projects: IconHammer,
    };

    // Select the icon based on the title; default to IconBriefcase if not found
    const SelectedIcon = iconMap[title.toLowerCase()] || IconCopy;
</script>

<a href={`/${title.toLowerCase()}`}>
    <Card.Root
        class="overflow-hidden rounded-none relative transition-colors hover:bg-muted/50 hover:border-muted-foreground p-4 h-full hover:border-b-muted-foreground hover:border-b-8"
    >
        <span class="flex-row flex items-center justify-between">
            <h1
                class="text-4xl font-extrabold tracking-wider font-mono uppercase"
            >
                {title}
            </h1>
            <SelectedIcon class="size-10" />
        </span>
        <SelectedIcon
            class="absolute opacity-10 size-64 left-0 translate-x-[-33%] stroke-1"
        />
    </Card.Root>
</a>
