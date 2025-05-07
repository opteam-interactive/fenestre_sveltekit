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
    <input
        type="radio"
        class="radio radio-sm radio-info"
        {name}
        {value}
        bind:group
    />
    <label for={name}>{label}</label>
</div>
