<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import { Badge } from "@/components/ui/badge";

    type Props = {
        title: string;
        url?: string;
        tags: string[];
    };

    const {
        title,
        url,
        tags = [
            "example",
            "test",
            "whatever",
            "example",
            "test",
            "whatever",
            "example",
            "test",
            "whatever",
            "example",
            "test",
            "whatever",
        ],
    }: Props = $props();
</script>

<Card.Root
    class="group rounded-none transition-colors hover:bg-muted hover:border-muted-foreground overflow-hidden"
>
    <div class="aspect-video border-b border-b-border relative">
        <img
            class="absolute group-hover:brightness-105"
            src="/sample.png"
            alt={title + "Header Image"}
        />
    </div>

    <Card.Header>
        <Card.Title class="font-mono">{title}</Card.Title>
        <Card.Description>2024 - Present</Card.Description>
    </Card.Header>
    <Card.Content></Card.Content>
    <Card.Footer class="flex gap-2 flex-row flex-wrap">
        {#each tags as tag}
            <Badge>{tag}</Badge>
        {/each}
    </Card.Footer>
</Card.Root>
