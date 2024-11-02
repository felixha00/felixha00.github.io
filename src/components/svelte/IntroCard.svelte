<script lang="ts">
    import * as Card from "@/components/ui/card/index";
</script>

<Card.Root class="rounded-none transition-colors border-primary">
    <Card.Header>
        <slot name="profile-picture" />
        <Card.Title>Felix Ha</Card.Title>
        <Card.Description
            >Software Engineer @ Evertz Microsystems</Card.Description
        >
    </Card.Header>
    <Card.Content>
        <!-- <p>Card Content</p> -->
    </Card.Content>
    <Card.Footer></Card.Footer>
</Card.Root>
