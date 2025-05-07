<script lang="ts">
    import type { Snippet } from "svelte";
    import FieldErrors from "./FieldErrors.svelte";
    let {
        children,
        label,
        error,
    }: { children: Snippet; label: string; error: string[] | undefined } = $props();
</script>

<div>
    <label class="fieldset-label text-info" for="category">{label}</label>
    <div class="flex flex-col gap-2 my-2">
        {@render children()}
    </div>
    <FieldErrors fieldError={error} />
</div>
