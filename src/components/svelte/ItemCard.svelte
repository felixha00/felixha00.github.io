<script lang="ts">
    import * as Card from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { Badge } from "@/components/ui/badge";
    import CardCorners from "../visual/CardCorners.svelte";
    import { onMount } from "svelte";
    import {
        IconExternalLink,
        IconTag,
        IconWindowMaximize,
    } from "@tabler/icons-svelte";

    type Props = {
        id: string;
        dir: string;
        title: string;
        cover: string;
        summary: string;
        date?: string;
        url?: string;
        tags: string[];
    };

    const {
        id,
        dir,
        cover,
        title,
        summary,
        url,
        date,
        tags = [],
    }: Props = $props();

    let image: HTMLImageElement;
    let canvas: HTMLCanvasElement;

    // onMount(() => {
    //     const ctx = canvas?.getContext("2d");

    //     console.log(image, canvas);

    //     // Load the image onto the canvas and apply the dithering effect
    //     // Set canvas dimensions to match the image
    //     canvas.width = image.width;
    //     canvas.height = image.height;
    //     ctx.drawImage(image, 0, 0, image.width, image.height);

    //     // Get pixel data from the canvas
    //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //     const data = imageData.data;

    //     // Apply a simple dithering effect
    //     for (let i = 0; i < data.length; i += 4) {
    //         const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
    //         const ditheredValue = grayscale > 128 ? 255 : 0;

    //         // Set pixels to dithered grayscale
    //         data[i] = data[i + 1] = data[i + 2] = ditheredValue;
    //     }

    //     // Update the canvas with the dithered image
    //     ctx.putImageData(imageData, 0, 0);
    //     image.style.display = "none";
    //     canvas.style.display = "block";
    // });
</script>

<Card.Root
    class="group flex flex-col relative rounded-none transition-colors hover:bg-muted/20 hover:border-muted-foreground"
>
    <a
        href={dir}
        class="aspect-[2] border-b border-b-border border-dashed relative"
    >
        <img
            bind:this={image}
            id="originalImage"
            class="aspect-[2] object-cover absolute group-hover:brightness-105"
            src={cover?.src ?? "/gradient.jpg"}
            alt={title + "Header Image"}
        />
    </a>
    <!-- <canvas id="canvas" bind:this={canvas}></canvas> -->

    <div class="flex flex-row h-full">
        <div class="flex flex-col grow">
            <Card.Header>
                <span class="w-full flex items-center justify-between"
                    ><Card.Title class="font-mono">{title}</Card.Title>
                </span>
                <Card.Description>{date}</Card.Description>
            </Card.Header>
            <Card.Content class="grow">
                {#if summary}
                    <p>{summary}</p>
                {/if}
            </Card.Content>
            <Card.Footer class="flex gap-2 flex-row flex-wrap">
                <!-- {#each tags as tag} -->
                <Badge>{tags[0]}</Badge>
                <!-- {/each} -->
            </Card.Footer>
        </div>
        <aside
            class="flex flex-col gap-0 border-l border-dashed justify-end [&>*]:mt-[-1px] [&>*]:ml-[-1px]"
        >
            {#if tags.length}
                <Button variant="outline" size="icon" class="rounded-none">
                    <IconTag />
                </Button>
            {/if}

            {#if url}<a href={url}
                    ><Button variant="outline" size="icon" class="rounded-none">
                        <IconExternalLink />
                    </Button>
                </a>
            {/if}

            {#if dir}<a href={dir}
                    ><Button size="icon" class="rounded-none">
                        <IconWindowMaximize />
                    </Button>
                </a>
            {/if}
        </aside>
    </div>
    <CardCorners />
</Card.Root>
