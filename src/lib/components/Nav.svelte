<script lang="ts">
    import { enhance } from "$app/forms";
    import logo from "$lib/assets/images/logo_peugeot.png";
    import { page } from '$app/state';

</script>

<div>
    <div class="navbar">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h8m-8 6h16"
                        />
                    </svg>
                </div>
                <ul
                    tabindex="-1"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                <li><a href="/espace-client" class={ page.url.pathname === '/espace-client' ? 'text-customgreen font-bold' : '' }>Mon compte</a></li>
                <li><a href="/espace-client/prendre-rdv" class={ page.url.pathname === '/espace-client/prendre-rdv' ? 'text-customgreen font-bold' : '' }>Prendre RDV</a></li>
                <li><a href="/espace-client/mes-rdv" class={ page.url.pathname === '/espace-client/mes-rdv' ? 'text-customgreen font-bold' : '' }>Mes RDV</a></li>
                </ul>
            </div>

            <a href="/espace-client" class="flex gap-2 items-center text-xl px-4 hover:transform hover:scale-105 transition">
                <img src={logo} alt="" class="w-12" />
                Garage Benoist Fenestre
            </a>
        </div>

        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <li><a href="/espace-client" class={ page.url.pathname === '/espace-client' ? 'text-customgreen font-bold' : '' }>Mon compte</a></li>
                <li><a href="/espace-client/prendre-rdv" class={ page.url.pathname === '/espace-client/prendre-rdv' ? 'text-customgreen font-bold' : '' }>Prendre RDV</a></li>
                <li><a href="/espace-client/mes-rdv" class={ page.url.pathname === '/espace-client/mes-rdv' ? 'text-customgreen font-bold' : '' }>Mes RDV</a></li>
            </ul>
        </div>
        <div class="navbar-end">
            <!-- Call the "logout method of the espace-client page" -->
            <form action="/espace-client?/logout" method="POST" use:enhance>
                <button type="submit" class="btn btn-error  text-white rounded-md p-2 text-xs"
                    >Deconnexion</button
                >
            </form>
        </div>
    </div>
</div>

<style>
</style>
