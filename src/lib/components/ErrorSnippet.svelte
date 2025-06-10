<script lang="ts">
let { error, reset } : { error: unknown; reset: () => void} = $props();
</script>

<div class="flex flex-col gap-2 max-w-1/2 p-4 border border-red-500">
    <p class=" text-red-500">{error}</p>
        <button onclick={reset}>RESET</button>
</div>