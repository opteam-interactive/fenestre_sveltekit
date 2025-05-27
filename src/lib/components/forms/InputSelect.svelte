<script lang="ts">
    import type { Snippet } from "svelte";
    type Props = {
        label: string;
        placeholder?: string;
        name: string;
        value: any;
        onchange ?: any;
        fieldError?: string[] | undefined;
        disabled ?: boolean

        children: Snippet;
    };
    
    let {
        label,
        placeholder,
        name,
        value = $bindable(),
        fieldError,
        onchange,
        disabled,
        children,
        ...others
    }: Props = $props();
</script>

<div>
    <label class="fieldset-label text-info" for={name}>{label}</label>
    <select
        class="select w-full rounded-full"
        name={name}
        onchange={$onchange}
        disabled={disabled}
        bind:value
        {...others}
    >
        {@render children()}
    </select>
    {#if fieldError}
        <span class="invalid">{fieldError}</span>
    {/if}
</div>
