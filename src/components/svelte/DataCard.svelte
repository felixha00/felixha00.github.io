<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import type { Icon } from "@tabler/icons-svelte";
    import { IconDatabase } from "@tabler/icons-svelte";

    type Props = {
        title: string;
    };

    let { title }: Props = $props();
</script>

<Card.Root
    class="overflow-hidden rounded-none relative transition-colors hover:bg-muted/50 hover:border-muted-foreground p-4 h-full"
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

    <div class="absolute bottom-0 right-0 size-8 bg-primary"></div>
</Card.Root>
