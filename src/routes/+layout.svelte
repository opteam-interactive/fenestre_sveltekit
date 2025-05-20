<script lang="ts">
    import "../app.css";
    import Footer from "$lib/components/Footer.svelte";
    let { children } = $props();
</script>

<div
    class="bg-[url($lib/assets/images/background.png)] bg-cover font-poppins relative min-h-screen flex flex-col"
>
    <header >
 
    </header>
    <main class=" grow flex flex-col">
        {@render children()}
    </main>
    <footer>
       <Footer/> 
    </footer>
</div>
