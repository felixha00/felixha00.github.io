<script lang="ts">
    import * as Menubar from "@/components/ui/menubar";
    import {
        IconBrandGithub,
        IconBrandLinkedinFilled,
    } from "@tabler/icons-svelte";
    import { Button } from "@/components/ui/button";
    import socials from "@/config/socials.json";

    let bookmarks = $state(false);
    let fullUrls = $state(true);
    let profileRadioValue = $state("benoit");
</script>

<nav class="flex flex-row">
    <a href={"/"} data-sveltekit-preload-data="hover">
        <Button class="rounded-none">Felix Ha</Button>
    </a>
    <Menubar.Root class="flex-grow">
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
        <a href={socials.github}>
            <Button size="icon" variant="ghost">
                <IconBrandGithub />
            </Button>
        </a>
        <a href={socials.linkedin}>
            <Button size="icon" variant="ghost">
                <IconBrandLinkedinFilled />
            </Button>
        </a>
    </Menubar.Root>
</nav>
