<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import type { Icon } from "@tabler/icons-svelte";
    import { IconBriefcase } from "@tabler/icons-svelte";

    type Props = {
        title: string;
    };

    let { title }: Props = $props();
</script>

<a href={`/${title.toLowerCase()}`}>
    <Card.Root
        class="rounded-none transition-colors hover:bg-muted/50 hover:border-muted-foreground p-4 h-full"
    >
        <span class="flex-row flex items-center justify-between">
            <h1
                class="text-4xl font-extrabold tracking-wider font-mono uppercase"
            >
                {title}
            </h1>
            <IconBriefcase class="size-10" />
        </span>
        <!-- <Card.Header>
        <slot name="profile-picture" />
        <Card.Title>Felix Ha</Card.Title>
        <Card.Description
            >Software Engineer @ Evertz Microsystems</Card.Description
        >
    </Card.Header>
    <Card.Content>
        <p>Card Content</p>
    </Card.Content>
    <Card.Footer>
        <p>Card Footer</p>
    </Card.Footer> -->
    </Card.Root>
</a>
