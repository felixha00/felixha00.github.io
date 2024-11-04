<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import CardCorners from "../visual/CardCorners.svelte";
    import { onMount } from "svelte";

    let time = $state(new Date());

    // these automatically update when `time`
    // changes, because of the `$:` prefix
    let hours = $derived(time.getHours());
    let minutes = $derived(time.getMinutes());
    let seconds = $derived(time.getSeconds());

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<Card.Root
    class="rounded-none relative transition-colors flex items-center justify-center p-4"
>
    <div class="absolute top-0 left-0 p-4">
        <h1>{time.toLocaleDateString()}</h1>
        <h1>{time.toLocaleTimeString()}</h1>
    </div>
    <div class="rounded-full [&>*]:rounded-full">
        <slot name="profile-picture" />
    </div>
    <img
        src="/felix-ha-circular-text.svg"
        class="absolute size-72 text-spin dark:invert"
    />
    <!-- <img
        src="/felix-ha-circular-text.svg"
        class="absolute size-[105%] text-spin"
    /> -->

    <!-- <Card.Header>
        <Card.Title>Felix Ha</Card.Title>
        <Card.Description
            >Software Engineer @ Evertz Microsystems</Card.Description
        >
    </Card.Header>
    <Card.Content></Card.Content>
    <Card.Footer></Card.Footer> -->
    <CardCorners />
</Card.Root>

<style>
    .text-spin {
        animation: spin 15s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(360deg);
        }
        to {
            transform: rotate(0deg);
        }
    }
</style>
