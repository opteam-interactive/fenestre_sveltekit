<script lang="ts">
    type Props = {
        label: string;
        name: string;
        checked: boolean;
        fieldError: string[] | undefined;
        id: string
    }
let { label, name, id,checked = $bindable(), fieldError, ...others } : Props = $props();
</script>

<div>
    <label class="fieldset-label text-info" for={`${name}-${id}`}>
        <input
            type="checkbox"
            class="checkbox"
            name={name}
            id={`${name}-${id}`}
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