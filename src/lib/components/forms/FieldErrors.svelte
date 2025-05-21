<script lang="ts">
    type Props = {
        fieldError: string[] | string | undefined;
    };
    let { fieldError } : Props= $props();
</script>

{#if fieldError}
    <span class="text-red-500 ps-2 text-xs">{fieldError}</span>
{/if}
