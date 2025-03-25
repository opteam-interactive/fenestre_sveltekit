<script lang="ts">
    import { onMount } from "svelte";

   let {field} = $props()

    onMount(async () => {
        if (field) {
            const Pikaday = (await import("pikaday")).default; // Dynamic import
            const picker = new Pikaday({
                field: field,
            });

            return () => picker.destroy();
        }
    });
</script>

<input type="text" class="input pika-single" bind:value={field} />