<script lang="ts">
    import type { Snippet } from "svelte";

    let { columns, children }: { columns?: number; children: Snippet } = $props();
    const defaultColumns = 2;
    const classes = `grid grid-cols-${columns ?? defaultColumns} gap-4  md-gap-8 items-end`;
</script>

<div class={classes}>
    {@render children()}
</div>
