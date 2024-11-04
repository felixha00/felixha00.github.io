<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import { Badge } from "@/components/ui/badge";
    import CardCorners from "../visual/CardCorners.svelte";

    type Props = {
        title: string;
        url?: string;
        tags: string[];
    };

    const {
        title,
        url,
        tags = ["example", "test", "whatever", "example", "test"],
    }: Props = $props();
</script>

<Card.Root
    class="group flex flex-col relative rounded-none transition-colors hover:bg-muted hover:border-muted-foreground"
>
    <a href="/projects" class="aspect-video border-b border-b-border relative">
        <img
            class="absolute group-hover:brightness-105"
            src="/sample.png"
            alt={title + "Header Image"}
        />
    </a>

    <Card.Header>
        <Card.Title class="font-mono">{title}</Card.Title>
        <Card.Description>2024 - Present</Card.Description>
    </Card.Header>
    <Card.Content class="grow prose">
        Lorem ipsum dolor sit amet, consectetur adipiscing
    </Card.Content>
    <Card.Footer class="flex gap-2 flex-row flex-wrap">
        {#each tags as tag}
            <Badge>{tag}</Badge>
        {/each}
    </Card.Footer>
    <CardCorners />
</Card.Root>
