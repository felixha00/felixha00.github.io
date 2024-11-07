<script lang="ts">
    import * as Card from "@/components/ui/card/index";
    import CardCorners from "../visual/CardCorners.svelte";
    import { onMount } from "svelte";

    let time = $state(new Date());
    let temperature = $state(null);

    // these automatically update when `time`
    // changes, because of the `$:` prefix
    // let hours = $derived(time.getHours());
    // let minutes = $derived(time.getMinutes());
    // let seconds = $derived(time.getSeconds());
    let randomCharacters = $state("");

    function generateRandomString(length: number) {
        const chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
        let result = "";
        for (let i = 0; i < length; i++) {
            result +=
                chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
        }
        return result;
    }

    onMount(() => {
        randomCharacters = generateRandomString(800);

        // fetch(
        //     "https://api.open-meteo.com/v1/forecast?latitude=43.7&longitude=-79.42&current_weather=true",
        // )
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (data.current_weather) {
        //             temperature = data.current_weather.temperature;
        //         }
        //     })
        //     .catch((error) =>
        //         console.error("Error fetching weather data:", error),
        //     );

        const interval = setInterval(() => {
            time = new Date();
            randomCharacters = generateRandomString(800);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<!-- class="absolute before top-0 left-0 p-4 z-20 before:absolute before:inset-0 before:bg-card before:-z-10 before:p-0" -->
<Card.Root
    class="rounded-none relative transition-colors flex items-center justify-center p-4 pointer-events-none"
>
    <div class="absolute before top-0 left-0 p-4 z-20">
        <h1
            class="font-mono relative pr-2 z-0 w-fit before:absolute before:inset-0 before:bg-card before:-z-10"
        >
            {time.toDateString()}
        </h1>
        <h1
            class="font-mono relative pr-2 z-0 w-fit before:absolute before:inset-0 before:bg-card before:-z-10"
        >
            {time.toLocaleTimeString()}
        </h1>
        {#if temperature !== null}
            <h2
                class="font-mono relative pr-2 z-0 w-fit before:absolute before:inset-0 before:bg-card before:-z-10"
            >
                {temperature}°C
            </h2>
        {/if}
    </div>

    <!-- <div class="absolute before bottom-0 right-0 p-4 z-20">
        <a
            href="/"
            class="font-mono relative z-0 pl-2 w-fit before:absolute before:inset-0 before:bg-card before:-z-10"
        >
            felixha.com
        </a>
    </div> -->

    <div
        class="rounded-full [&_*]:rounded-full [&_*]:border-primary [&_*]:border-4 z-10"
    >
        <slot name="profile-picture" />
    </div>

    <!-- <div
        class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex items-center justify-center"
    >
        <img
            alt="Felix Ha spinning text"
            src="/felix-ha-circular-text.svg"
            class="size-[42rem] text-spin dark:invert z-10 grow max-w-[200%]"
        />
    </div> -->

    <div
        class="absolute top-0 left-0 right-0 bottom-0 m-4 opacity-50 font-mono text-justify overflow-hidden bg-clip-text text-transparent
        dark:bg-[radial-gradient(circle,transparent,transparent,white,transparent)]
        bg-[radial-gradient(circle,transparent,transparent,black,transparent)]"
    >
        {randomCharacters}
    </div>
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

    @keyframes pulse {
        0% {
            opacity: 0.5;
        }
        50% {
            opacity: 0.125;
        }
        100% {
            opacity: 0.5;
        }
    }
    .animate-pulse {
        animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>
