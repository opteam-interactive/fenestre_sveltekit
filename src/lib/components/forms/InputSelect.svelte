<script lang="ts">
    import type { Snippet } from "svelte";
    type Props = {
        label: string;
        placeholder?: string;
        name: string;
        value: any;
        onchange ?: any;
        fieldError?: string[] | undefined;

        children: Snippet;
    };
    
    let {
        label,
        placeholder,
        name,
        value = $bindable(),
        fieldError,
        onchange,
        children,
        ...others
    }: Props = $props();
</script>

<div>
    <label class="fieldset-label text-info" for={name}>{label}</label>
    <select
        class="select w-full rounded-full"
        name="rdvCategory"
        onchange={$onchange}
        bind:value
        {...others}
    >
        {@render children()}
    </select>
    {#if fieldError}
        <span class="invalid">{fieldError}</span>
    {/if}
</div>
