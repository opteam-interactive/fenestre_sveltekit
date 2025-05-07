<script lang="ts">
    type Message = {
        status: string;
        text: string;
    }
let { message } : { message: Message } = $props();
</script>

{#if message}
    <h3
        class={message.status == "success" ? "text-green-400" : "text-red-400"}
    >
        {message.text}
    </h3>
{/if}