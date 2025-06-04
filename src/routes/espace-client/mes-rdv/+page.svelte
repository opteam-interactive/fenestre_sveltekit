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
</script>

<TitleBanner title="Mes Rendez-vous" subtitle="" />
<div class="max-w-3/4 mx-auto text-sm">
    {#if userRdvs.length < 1}
        <h2 class="font-semibold">Pas de RDV en attente</h2>
    {/if}

    {#if userRdvs}
       <section class="flex flex-col gap-4">
            <div >
                <div>
                    <h2 class="font-semibold">Rendez-vous à venir</h2>
                    <div class="grid md:grid-cols-2 lg:grid-cols-4">
                        {#each upcomingRdvs as rdv}
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
    
                                <div>
                                    <h2 class="font-bold text-customblue">
                                        Véhicule:
                                    </h2>
                                    <p>{rdv.Marque} - {rdv.Modèle}</p>
                                </div>
    
                                <div>
                                    <h2 class="font-bold text-customblue">
                                        Travaux:
                                    </h2>
                                    <p>
                                        {rdv.Travaux.replace("â‚¬", "€").replace(
                                            "-",
                                            "\n"
                                        )}
                                    </p>
                                </div>
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
                                <h2 class="font-bold text-gray-600">
                                    Date de restitution:
                                </h2>
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
                                <h2 class="font-bold text-gray-600">Véhicule:</h2>
                                <p>{rdv.Marque} - {rdv.Modèle}</p>
                            </div>
    
                            <div>
                                <h2 class="font-bold text-gray-600">Travaux:</h2>
                                <p>
                                    {rdv.Travaux.replace("â‚¬", "€").replace(
                                        "-",
                                        "\n"
                                    )}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
       </section>
    {/if}
</div>
