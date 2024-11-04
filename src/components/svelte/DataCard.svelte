<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import { IconDatabase } from "@tabler/icons-svelte";
    import CardCorners from "@/components/visual/CardCorners.svelte";

    type Props = {
        title: string;
    };

    let { title }: Props = $props();
</script>

<Card.Root
    class="rounded-none relative transition-colors hover:bg-muted/50 hover:border-muted-foreground p-4 h-full"
>
    <Card.Header>
        <span class="flex-row flex items-center justify-between">
            <h1
                class="text-4xl font-extrabold tracking-wider font-mono uppercase"
            >
                {title}
            </h1>
            <IconDatabase class="size-10 stroke-muted" />
        </span>
    </Card.Header>

    <Card.Content>
        <div class="prose">
            <slot name="md" />
        </div>
    </Card.Content>
    <CardCorners />
</Card.Root>
