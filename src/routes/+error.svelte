<script lang="ts">
	import { page } from '$app/state';
</script>

<div class=" flex flex-col items-center justify-center  grow gap-6">
	<h1 class="text-5xl">ERROR</h1>
	<h1 class="text-red-500 text-2xl">{page.status}: {page.error?.message}</h1>
</div>
