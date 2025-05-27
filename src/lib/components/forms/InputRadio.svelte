<script lang="ts">
    type Props = {
        label: string;
        name: string;
        group: any;
        fieldError: string[] | undefined;
        value: string;
    };
    let {
        label,
        name,
        group = $bindable(),
        fieldError,
        value,
        ...others
    }: Props = $props();
</script>

<div>
    <label for={`${name}-${value}`} >
        <input
            type="radio"
            class="radio radio-sm radio-info"
            id={`${name}-${value}`}
            {name}
            {value}
            bind:group
        />
        {label}
    </label>
</div>
