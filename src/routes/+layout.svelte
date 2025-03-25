<script lang="ts">
    import "../app.css";
    import Footer from "$lib/components/Footer.svelte";
    let { children } = $props();
</script>

<div
    class="bg-[url($lib/assets/images/background.png)] bg-cover font-poppins relative min-h-screen"
>
    <header>
 
    </header>
    <main>
        {@render children()}
    </main>
    <footer>
       <Footer/> 
    </footer>
</div>
