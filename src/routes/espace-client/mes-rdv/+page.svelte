<script lang="ts">
    import { format } from "date-fns";
    import type { WebdevRendezVous } from "$lib/types/types";
    import TitleBanner from "$lib/components/sections/TitleBanner.svelte";
    let { data } = $props();
    let userRdvs = data.userRdvs as WebdevRendezVous[];
</script>

<TitleBanner title="Mes Rendez-vous" subtitle="" />

{#if userRdvs == null}
    <h2 class="font-semibold">Pas de RDV en attente</h2>
{/if}

{#if userRdvs}
    <div class="grid md:grid-cols-2 lg:grid-cols-4">
        {#each userRdvs as rdv}
            <div
                class="flex flex-col gap-4 p-8 rounded-md shadow m-8 bg-white border hover:-translate-0.5 transition"
            >
                <h2>
                    <span class="font-bold text-customblue">Date de dépot:</span
                    >
                    {new Date(rdv.DateRécept).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    })}
                </h2>

                <h2>
                    <span class="font-bold text-customblue"
                        >Date de restitution:</span
                    >
                    {new Date(rdv.DateRestit).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    })}
                </h2>

                <h2>
                    <span class="font-bold text-customblue"
                        >Véhicule:
                    </span>{rdv.Marque} - {rdv.Modèle}
                </h2>

                <h2>
                    <span class="font-bold text-customblue">Travaux:</span>
                </h2>
                <p>{rdv.Travaux.replace("â‚¬", "€")}</p>
            </div>
        {/each}
    </div>
{/if}
