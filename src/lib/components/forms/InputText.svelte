<script lang="ts">
    type Props = {
        label: string;
        type?: string;
        placeholder: string;
        name: string;
        value: any;
        fieldError: string[] | undefined;
    }
let { label, placeholder, name, type="text", value = $bindable(), fieldError, ...others } : Props = $props();
</script>

<div>
    <label class="fieldset-label text-info" for={name}
        >{label}</label
    >
    <input
        type={type}
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