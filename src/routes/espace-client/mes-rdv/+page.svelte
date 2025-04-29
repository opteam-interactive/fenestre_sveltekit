<script lang="ts">
    import { format } from "date-fns";
    import type { WebdevRendezVous } from "$lib/types/types";
    let { data } = $props();
    let userRdvs = data.userRdvs as WebdevRendezVous[];
</script>

<div>
    <section class="flex flex-col items-center gap-4 md-p-12">
        <h1 class="mb-2 uppercase font-terminaBold text-customblue">
            Vos Rendez-vous
        </h1>
        {#if userRdvs == null}
            <h2 class="font-semibold">Pas de RDV en attente</h2>
        {/if}

        {#if userRdvs}
            <div class="grid md:grid-cols-2 lg:grid-cols-4">
                {#each userRdvs as rdv}
                    <div
                        class="flex flex-col gap-4 p-12 rounded-md shadow m-8 bg-white border hover:-translate-0.5 transition"
                    >
                        <h2>
                            <span class="font-bold text-customblue"
                                >Date de dépot:</span
                            >
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
                        </h2>

                        <h2>
                            <span class="font-bold text-customblue"
                                >Date de restitution:</span
                            >
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
                        </h2>

                        <h2>
                            <span class="font-bold text-customblue"
                                >Véhicule:
                            </span>{rdv.Marque} - {rdv.Modèle}
                        </h2>

                        <h2>
                            <span class="font-bold text-customblue"
                                >Travaux:</span
                            >
                        </h2>
                        <p>{rdv.Travaux.replace("â‚¬", "€")}</p>
                    </div>
                {/each}
            </div>
        {/if}
    </section>
</div>

<style>
</style>
