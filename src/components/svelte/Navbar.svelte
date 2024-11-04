<script lang="ts">
    import * as Menubar from "@/components/ui/menubar";
    import {
        IconBrandGithub,
        IconBrandLinkedinFilled,
        IconDownload,
    } from "@tabler/icons-svelte";
    import { Button } from "@/components/ui/button";
    import ModeToggle from "./ModeToggle.svelte";

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
</script>

<nav
    class="z-50 flex flex-row fixed w-full border-b border-b-primary bg-background/80 backdrop-blur-sm"
>
    <a
        href={"/"}
        data-sveltekit-preload-data="hover"
        onmouseenter={changeNickname}
        onmouseleave={() => (currentNickname = "Felix")}
    >
        <Button class="rounded-none">{currentNickname} Ha</Button>
    </a>
    {#each pathSegments as pathSegment}
        <p>{pathSegment}</p>
    {/each}
    <!-- <Menubar.Root class="flex-grow rounded-none p-0">
        <Menubar.Menu>
            <Menubar.Trigger>Edit</Menubar.Trigger>
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
    <div class="grow" />
    <a href={socials.github}>
        <Button size="icon" variant="ghost">
            <IconBrandGithub />
        </Button>
    </a>
    <a href={socials.linkedin}>
        <Button size="icon" variant="ghost" class="rounded-none">
            <IconBrandLinkedinFilled />
        </Button>
    </a>
    <ModeToggle />
    <a href={socials.resume}>
        <Button class="rounded-none">
            Resume <IconDownload />
        </Button>
    </a>
</nav>
