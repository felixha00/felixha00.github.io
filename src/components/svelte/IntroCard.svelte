<script lang="ts">
    import * as Card from "@/components/ui/card/index";
</script>

<Card.Root class="rounded-none transition-colors border-primary">
    <Card.Header>
        <Card.Title>Felix Ha</Card.Title>
        <Card.Description
            >Software Engineer @ Evertz Microsystems</Card.Description
        >
    </Card.Header>
    <Card.Content>
        <slot name="profile-picture" />
        <!-- <p>Card Content</p> -->
    </Card.Content>
    <Card.Footer></Card.Footer>
</Card.Root>
