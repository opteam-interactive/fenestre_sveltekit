<script lang="ts">
    let { message, status }: { message: string; status: number } = $props();
</script>

{#if message && status == 200}
    <h3 class="text-green-400 mx-auto max-w-3/4 text-sm text-center" >
        {message}
    </h3>
{:else if message && status >= 400}
    <h3 class="text-red-400 mx-auto max-w-3/4 text-sm text-center">
        {message}
    </h3>
{:else}
    <h3 class="text-blue-400 mx-auto max-w-3/4 text-sm text-center">
        {message}
    </h3>
{/if}
