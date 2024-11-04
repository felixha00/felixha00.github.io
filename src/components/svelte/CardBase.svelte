<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import CardCorners from "@/components/visual/CardCorners.svelte";
    import type { Snippet } from "svelte";

    type Props = {
        title: string;
        children: Snippet
    };

    let { title, children }: Props = $props();
</script>

<Card.Root
    class="flex flex-col rounded-none relative transition-colors hover:bg-muted/50 hover:border-muted-foreground p-4 h-full"
>
    {@render children()}
    <CardCorners />
</Card.Root>
