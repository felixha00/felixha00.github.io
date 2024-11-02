<script lang="ts">
  import * as Card from "@/components/ui/card/index";
</script>

<Card.Root
  class="rounded-none transition-colors hover:bg-muted hover:border-muted-foreground"
>
  <Card.Header>
    <slot name="header-image" />
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <h1>Card Footer</h1>
  </Card.Footer>
</Card.Root>
