<script lang="ts">
    import logo from "$lib/assets/images/logo_peugeot.png";
    import { page } from "$app/state";
    import { enhance } from "$app/forms";

    // State for mobile menu
    let menuOpen = $state(false);
    

    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    $effect(()=>{
        if(page.url){
            menuOpen = false
        }
        
    })

   
    
</script>

<nav class=" px-4 py-2 flex items-center justify-between">
    <!-- Logo and Title -->
    <div class="flex items-center gap-2">
        <img src={logo} alt="" class="w-12" />
        <p class="hidden md:block">Garage Benoist Fenestre</p>
    </div>

    <!-- Desktop Links -->
    <div class="hidden md:flex items-center gap-6">
        <a
            href="/espace-client"
            class={page.url.pathname === "/espace-client"
                ? "text-customgreen font-bold"
                : ""}>Mon compte</a
        >
        <a
            href="/espace-client/prendre-rdv"
            class={page.url.pathname === "/espace-client/prendre-rdv"
                ? "text-customgreen font-bold"
                : ""}>Prendre RDV</a
        >
        <a
            href="/espace-client/mes-rdv"
            class={page.url.pathname === "/espace-client/mes-rdv"
                ? "text-customgreen font-bold"
                : ""}>Mes RDV</a
        >
        <form action="/espace-client?/logout" method="POST" use:enhance>
            <button
                type="submit"
                class="btn btn-error text-white rounded-md p-2 text-xs"
                >Deconnexion</button
            >
        </form>
    </div>

    <!-- Mobile Menu Button -->
    <button
        class="md:hidden flex items-center p-2 rounded hover:bg-gray-100"
        onclick={toggleMenu}
        aria-label="Toggle navigation"
    >
        <svg
            class="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d={menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"}
            />
        </svg>
    </button>
</nav>

<!-- Mobile Dropdown Menu -->
{#if menuOpen}
    <div class="md:hidden bg-white shadow-md px-4 py-2 flex flex-col gap-4 items-center rounded-md ">
        <a
            href="/espace-client"
            class={page.url.pathname === "/espace-client"
                ? "text-customgreen font-bold"
                : ""}>Mon compte</a
        >
        <a
            href="/espace-client/prendre-rdv"
            class={page.url.pathname === "/espace-client/prendre-rdv"
                ? "text-customgreen font-bold"
                : ""}>Prendre RDV</a
        >
        <a
            href="/espace-client/mes-rdv"
            class={page.url.pathname === "/espace-client/mes-rdv"
                ? "text-customgreen font-bold"
                : ""}>Mes RDV</a
        >
        <form action="/espace-client?/logout" method="POST" use:enhance>
            <button
                type="submit"
                class="btn btn-error text-white rounded-md p-2 text-xs"
                >Deconnexion</button
            >
        </form>
    </div>
{/if}
