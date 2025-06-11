

<script lang="ts">
let {message, status} : {message: string; status: number} = $props();
</script>
{#if message && status == 200}
<div class="toast z-10">
    <div class="alert alert-success">
        <span>{message}</span>
    </div>
</div>
{:else if message && status >= 400} 
<div class="toast z-10">
    <div class="alert alert-error">
        <span>{message}</span>
    </div>
</div>
{:else}
<div class="toast z-10">
    <div class="alert alert-info">
        <span>{message}</span>
    </div>
</div>
{/if}