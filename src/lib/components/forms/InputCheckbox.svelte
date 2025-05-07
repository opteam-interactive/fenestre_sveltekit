<script lang="ts">
    type Props = {
        label: string;
        name: string;
        checked: boolean;
        fieldError: string[] | undefined;
    }
let { label, name, checked = $bindable(), fieldError, ...others } : Props = $props();
</script>

<div>
    <label class="fieldset-label text-info" for={name}>
        <input
            type="checkbox"
            class="checkbox"
            name={name}
            bind:checked={checked}
            {...others}
            aria-invalid={fieldError ? "true" : undefined}
        />
        {label}
    </label>
    {#if fieldError}
        <span class="invalid">{fieldError}</span>
    {/if}
</div>