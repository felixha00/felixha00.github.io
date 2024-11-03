<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import { Badge } from "@/components/ui/badge";
    type Props = {
        title: string;
        url?: string;
        tags: string[];
    };

    const { title, url }: Props = $props();
</script>

<Card.Root
    class="rounded-none transition-colors hover:bg-muted hover:border-muted-foreground"
>
    <img class="aspect-video" src="/sample.png" alt={title + "Header Image"} />
    <Card.Header>
        <Card.Title class="font-mono">{title}</Card.Title>
        <Card.Description>2024 - Present</Card.Description>
    </Card.Header>
    <Card.Content></Card.Content>
    <Card.Footer>
        <Badge>Next.js</Badge>
    </Card.Footer>
</Card.Root>
