<script lang="ts">
    type Message = {
        status: string;
        text: string;
    }
let { message } : { message: Message } = $props();
</script>

{#if message}
  <div class="w-full text-center ">
        <h3
            class="{message.status == "success" ? "text-green-400" : "text-red-400"} mx-auto max-w-3/4"
        >
        
            {message.text}
        </h3>
  </div>
{/if}