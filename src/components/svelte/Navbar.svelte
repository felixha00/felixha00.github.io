<script lang="ts">
    import { IconDownload, IconMenu2 } from "@tabler/icons-svelte";
    import { Button } from "@/components/ui/button";
    import * as DropdownMenu from "@/components/ui/dropdown-menu";
    import ModeToggle from "./ModeToggle.svelte";
    import { Input } from "@/components/ui/input/index";
    import Searchbox from "@/components/searchbox.svelte";
    import socials from "@/config/socials.json";

    type Props = {
        url: URL;
    };
    const { url }: Props = $props();
    const pathSegments = url.pathname.split("/").filter((segment) => segment);

    // randomly iterate through nicknames
    let nicknames = [
        "Fellef",
        "Felan",
        "Fillip",
        "Filfred",
        "Felipe",
        "Fehelix",
    ];

    let currentNickname = $state("Felix");

    function changeNickname() {
        const randomIndex = Math.floor(Math.random() * nicknames.length);
        currentNickname = nicknames[randomIndex];
    }

    const navItems = {
        home: "/",
        projects: "/projects",
    };
</script>

<nav
    class="z-50 flex flex-row items-center fixed w-full border-b border-b-primary bg-card gap-0"
>
    <div class="flex items-center">
        <a
            href={"/"}
            data-sveltekit-preload-data="hover"
            onmouseenter={changeNickname}
            onmouseleave={() => (currentNickname = "Felix")}
            class="hidden md:flex"
        >
            <Button class="rounded-none pl-2">👋 {currentNickname} Ha</Button>
        </a>
        <!-- <a href={socials.github}>
            <Button class="rounded-none" size="icon" variant="outline">
                <IconSearch />
            </Button>
        </a> -->
    </div>

    <!-- {#each pathSegments as pathSegment}
        <p class="font-mono uppercase">{pathSegment}</p>
    {/each} -->

    {#each Object.entries(navItems) as [key, value]}
        <Button
            href={value}
            variant="ghost"
            class="hidden md:flex uppercase font-mono font-bold rounded-none"
            >{key}</Button
        >
    {/each}

    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <Button
                variant="outline"
                class="uppercase font-mono rounded-none font-semibold pl-3 flex md:hidden"
            >
                <IconMenu2 />
                <p class="mt-[3px]">{pathSegments[0] ?? "HOME"}</p>
            </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
            <DropdownMenu.Group>
                <!-- <DropdownMenu.GroupHeading>Navigation</DropdownMenu.GroupHeading
                >
                <DropdownMenu.Separator /> -->
                {#each Object.entries(navItems) as [key, value]}
                    <DropdownMenu.Item
                        ><a
                            href={value}
                            class="uppercase font-mono font-bold mt-[3px] w-full flex"
                            >{key}</a
                        ></DropdownMenu.Item
                    >
                {/each}
            </DropdownMenu.Group>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
    <!-- <Searchbox /> -->

    <div class="grow"></div>
    <div class="flex items-center">
        <ModeToggle />
        <a href={socials.resume}>
            <Button class="rounded-none">
                Resume <IconDownload />
            </Button>
        </a>
    </div>
</nav>
