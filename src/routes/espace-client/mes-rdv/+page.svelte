<script lang="ts">
    import { format } from "date-fns";
    import type { WebdevRendezVous } from "$lib/types/types";
    import TitleBanner from "$lib/components/sections/TitleBanner.svelte";
    let { data } = $props();
    let userRdvs = data.userRdvs as WebdevRendezVous[];
</script>

<TitleBanner title="Mes Rendez-vous" subtitle="" />
<div class="max-w-3/4 mx-auto">
    {#if userRdvs == null}
        <h2 class="font-semibold">Pas de RDV en attente</h2>
    {/if}

    {#if userRdvs}
        <div class="grid md:grid-cols-2 lg:grid-cols-4">
            {#each userRdvs as rdv}
                <div
                    class="flex flex-col gap-4 p-8 rounded-md shadow m-2 bg-white border hover:-translate-0.5 transition"
                >
                    <div>
                        <h2 class="font-bold text-customblue">
                            Date de dépot:
                        </h2>
                        <p>
                            {new Date(rdv.DateRécept).toLocaleDateString(
                                "fr-FR",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }
                            )}
                        </p>
                    </div>

                    <div>
                        <h2 class="font-bold text-customblue"> Date de restitution:</h2>
                        <p>
                            {new Date(rdv.DateRestit).toLocaleDateString(
                                "fr-FR",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }
                            )}
                        </p>
                    </div>

                    <div>
                        <h2 class="font-bold text-customblue">Véhicule:</h2>
                        <p>{rdv.Marque} - {rdv.Modèle}</p>
                    </div>

                    <div>
                        <h2 class="font-bold text-customblue">Travaux:</h2>
                        <p>{rdv.Travaux.replace("â‚¬", "€").replace("-", "\n")}</p>
                    </div>
                   
                </div>
            {/each}
        </div>
    {/if}
</div>
