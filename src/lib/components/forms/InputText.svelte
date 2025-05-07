<script lang="ts">
    type Props = {
        label: string;
        placeholder: string;
        name: string;
        value: any;
        fieldError: string[] | undefined;
    }
let { label, placeholder, name, value = $bindable(), fieldError, ...others } : Props = $props();
</script>

<div>
    <label class="fieldset-label text-info" for={name}
        >{label}</label
    >
    <input
        type="text"
        class="input w-full rounded-full"
        placeholder={placeholder}
        name={name}
        bind:value={value}
        {...others}
        aria-invalid={fieldError ? "true" : undefined}
    />
    {#if fieldError}
        <span class="invalid">{fieldError}</span>
    {/if}
</div>