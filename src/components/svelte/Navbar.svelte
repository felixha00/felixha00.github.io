<script lang="ts">
    import * as Menubar from "@/components/ui/menubar";
    import {
        IconBrandGithub,
        IconBrandLinkedinFilled,
        IconDownload,
        IconSearch,
        IconMenu2,
    } from "@tabler/icons-svelte";
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

    let bookmarks = $state(false);
    let fullUrls = $state(true);
    let profileRadioValue = $state("benoit");

    // randomly iterate through nicknames
    let nicknames = ["Fellef", "Felan", "Fillip", "Filfred", "Felipe"];
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

    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <Button
                variant="outline"
                class="uppercase font-mono rounded-none font-semibold pl-3"
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
    <!-- <Button
        href="/blog"
        variant="ghost"
        class="uppercase font-mono rounded-none font-semibold">BLOG</Button
    > -->

    <!-- <form class="flex w-full max-w-sm items-center space-x-2">
        <IconSearch class="size-4" />
        <Input class="h-8 w-32" placeholder="Search" />
    </form> -->

    <!-- <Menubar.Root class="flex-grow rounded-none p-0">
        <Menubar.Menu>
            <Menubar.Trigger
                ><p class="font-mono font-bold">HOME</p></Menubar.Trigger
            >
            <Menubar.Content>
                <Menubar.Item>
                    Undo <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item>
                    Redo <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Separator />
                <Menubar.Sub>
                    <Menubar.SubTrigger>Find</Menubar.SubTrigger>
                    <Menubar.SubContent>
                        <Menubar.Item>Search the web</Menubar.Item>
                        <Menubar.Separator />
                        <Menubar.Item>Find...</Menubar.Item>
                        <Menubar.Item>Find Next</Menubar.Item>
                        <Menubar.Item>Find Previous</Menubar.Item>
                    </Menubar.SubContent>
                </Menubar.Sub>
                <Menubar.Separator />
                <Menubar.Item>Cut</Menubar.Item>
                <Menubar.Item>Copy</Menubar.Item>
                <Menubar.Item>Paste</Menubar.Item>
            </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
            <Menubar.Trigger>View</Menubar.Trigger>
            <Menubar.Content>
                <Menubar.CheckboxItem bind:checked={bookmarks}
                    >Always Show Bookmarks Bar</Menubar.CheckboxItem
                >
                <Menubar.CheckboxItem bind:checked={fullUrls}>
                    Always Show Full URLs
                </Menubar.CheckboxItem>
                <Menubar.Separator />
                <Menubar.Item inset>
                    Reload <Menubar.Shortcut>⌘R</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item inset>
                    Force Reload <Menubar.Shortcut>⇧⌘R</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item inset>Toggle Fullscreen</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item inset>Hide Sidebar</Menubar.Item>
            </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
            <Menubar.Trigger>Profiles</Menubar.Trigger>
            <Menubar.Content>
                <Menubar.RadioGroup bind:value={profileRadioValue}>
                    <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
                    <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
                    <Menubar.RadioItem value="Luis">Luis</Menubar.RadioItem>
                </Menubar.RadioGroup>
                <Menubar.Separator />
                <Menubar.Item inset>Edit...</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item inset>Add Profile...</Menubar.Item>
            </Menubar.Content>
        </Menubar.Menu>
    </Menubar.Root> -->
    <div class="grow"></div>
    <!-- <a href={socials.github}>
        <Button size="icon" variant="ghost">
            <IconBrandGithub />
        </Button>
    </a>
    <a href={socials.linkedin}>
        <Button size="icon" variant="ghost" class="rounded-none">
            <IconBrandLinkedinFilled />
        </Button>
    </a> -->
    <div class="flex items-center">
        <ModeToggle />
        <a href={socials.resume}>
            <Button class="rounded-none">
                Resume <IconDownload />
            </Button>
        </a>
    </div>
</nav>
