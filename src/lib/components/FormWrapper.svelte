<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        customClass,
        title,
        children,
    }: { customClass: string; title: string; children?: Snippet } = $props();
    const appliedClasses = `bg-lightblue flex flex-col items-center gap-8 p-4 rounded-xl  ${customClass}`;
</script>


    <div class={appliedClasses}>
        <h2>{title}</h2>
        {#if children}
            {@render children()}
        {/if}
    </div>
