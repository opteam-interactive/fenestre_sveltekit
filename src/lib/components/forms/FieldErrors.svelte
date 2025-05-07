<script lang="ts">
    type Props = {
        fieldError: string[] | undefined;
    };
    let { fieldError } : Props= $props();
</script>

{#if fieldError}
    <span class="invalid">{fieldError}</span>
{/if}
