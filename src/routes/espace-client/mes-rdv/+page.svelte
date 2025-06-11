<script lang="ts">
    import { format } from "date-fns";
    import type { WebdevRendezVous } from "$lib/types/types";
    import TitleBanner from "$lib/components/sections/TitleBanner.svelte";
    let { data } = $props();
    let userRdvs = data.userRdvs as WebdevRendezVous[];
    const upcomingRdvs = userRdvs.filter(
        (rdv) => new Date(rdv.DateRestit) >= new Date()
    );
    const pastRdvs = userRdvs.filter(
        (rdv) => new Date(rdv.DateRestit) < new Date()
    );

    let selectedRdv = $state<WebdevRendezVous | null>(null);
    $inspect(selectedRdv);
</script>

<TitleBanner title="Mes Rendez-vous" subtitle="" />
<div class="max-w-3/4 mx-auto text-sm">
    {#if userRdvs.length < 1}
        <h2 class="font-semibold">Pas de RDV en attente</h2>
    {/if}

    {#if userRdvs.length >= 1}
        <section class="flex flex-col gap-4">
            <div>
                <div>
                    <h2 class="font-semibold">Rendez-vous à venir</h2>
                    <div class="grid md:grid-cols-2 lg:grid-cols-4">
                        {#each upcomingRdvs as rdv, index}
                            <div
                                class="flex flex-col gap-4 p-4 rounded-md shadow m-2 bg-white border hover:-translate-0.5 transition"
                            >
                                <div>
                                    <h2 class="font-bold text-customblue">
                                        Date de dépot:
                                    </h2>
                                    <p>
                                        {new Date(
                                            rdv.DateRécept
                                        ).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <h2 class="font-bold text-customblue">
                                        Date de restitution:
                                    </h2>
                                    <p>
                                        {new Date(
                                            rdv.DateRestit
                                        ).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}
                                    </p>
                                </div>
                                <button class="btn btn-info" onclick={() => (selectedRdv = rdv)}>Voir les détails</button>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
            <div>
                <h2 class="font-semibold">Rendez-vous passés</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4">
                    {#each pastRdvs as rdv}
                        <div
                            class="flex flex-col gap-4 p-4 rounded-md shadow m-2 bg-gray-200 border hover:-translate-0.5 transition"
                           
                        >
                            <div>
                                <h2 class="font-bold text-gray-600">
                                    Date de dépot:
                                </h2>
                                <p>
                                    {new Date(
                                        rdv.DateRécept
                                    ).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                    })}
                                </p>
                            </div>

                            <div>
                                <h2 class="font-bold text-gray-600">
                                    Date de restitution:
                                </h2>
                                <p>
                                    {new Date(
                                        rdv.DateRestit
                                    ).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                    })}
                                </p>
                            </div>
                            <button class="btn " onclick={() => (selectedRdv = rdv)}>Voir les détails</button>
                        </div>
                    {/each}
                </div>
            </div>
        </section>
    {/if}
</div>

<!-- MODAL -->
{#if selectedRdv}
    <div
        class="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50"
    >
        <div class="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg flex flex-col justify-center gap-2">
            <h2 class="text-xl font-bold mb-4">Détails du rendez-vous</h2>

            <p>
                <strong>Dépot :</strong>
                {new Date(selectedRdv.DateRécept).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                })}
            </p>
            <p>
                <strong>Restitution :</strong>
                {new Date(selectedRdv.DateRestit).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                })}
            </p>
            <p>
                <strong>Véhicule :</strong>
                {selectedRdv.Marque} - {selectedRdv.Modèle}
            </p>
            <p>
                <strong>Travaux :</strong>
                {selectedRdv.Travaux.replace("â‚¬", "€").replace("-", "\n")}
            </p>

            <button
                class="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onclick={() => (selectedRdv = null)}
            >
                Fermer
            </button>
        </div>
    </div>
{/if}
