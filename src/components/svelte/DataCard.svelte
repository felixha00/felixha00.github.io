<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import { IconDatabase } from "@tabler/icons-svelte";
    import CardCorners from "@/components/visual/CardCorners.svelte";

    type Props = {
        title: string;
    };

    let { title }: Props = $props();
    const randomPosition = () =>
        `${Math.floor(Math.random() * 100)}% ${Math.floor(Math.random() * 100)}%`;
</script>

<!-- style={`background-image: url(${gradient.src}); background-position: ${randomPosition()};`} -->
<Card.Root
    class="rounded-none relative transition-colors hover:bg-muted/20 hover:border-muted-foreground h-full bg-blend-hard-light"
>
    <Card.Header>
        <span class="flex-row flex items-center justify-between">
            <h1 class="text-4xl font-bold uppercase">
                {title}
            </h1>
            <IconDatabase class="size-10 stroke-muted" />
        </span>
    </Card.Header>

    <Card.Content class="overflow-auto">
        <div class="prose">
            <slot name="md" />
        </div>
    </Card.Content>
    <CardCorners />
</Card.Root>
