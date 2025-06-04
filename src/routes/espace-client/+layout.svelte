<script lang="ts">
    import Nav from "$lib/components/Nav.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    const { children } = $props();
</script>

<section class="flex flex-col items-center gap-4 p-4  " id="top">
  <div class="w-full ">
        <Navbar />
    <div class="flex flex-col items-center">
        {@render children()}
    </div>
        
  </div>
</section>
