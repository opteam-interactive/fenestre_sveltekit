<script lang="ts">
let { title, subtitle } : { title: string; subtitle: string} = $props();
</script>

<div class="text-center">
    <h1 class="my-8 uppercase font-terminaBold text-customblue">
        {title}
    </h1>
    <h2 class="font-semibold text-customyellow">
        {subtitle}
    </h2>
</div>