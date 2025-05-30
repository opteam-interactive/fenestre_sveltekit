<script lang="ts">
    import type { Snippet } from "svelte";
   
    let {children, title}: { children: Snippet; title?: string} = $props();
</script>

<div>
    <p class="text-sm text-customblue font-bold mb-1">{title}</p>
    <div class="bg-white p-4 rounded-md mb-8">
        {@render children()}
    </div>
</div>
