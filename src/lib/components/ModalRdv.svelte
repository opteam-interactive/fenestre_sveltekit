<script lang="ts">
    import type { RendezVous, Motif } from "$lib/types/types";
    const {
        onclick,
        form,
        motifs,
    }: { onclick: () => void; form: RendezVous; motifs: Motif[] } = $props();
</script>

<div
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
>
    <div
        class="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
            <div
                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full"
                        >
                            <h3
                                class="text-base font-semibold text-gray-900"
                                id="modal-title"
                            >
                                Bilan de la réservation
                            </h3>
                            <div class="mt-2 text-base grid grid-cols-2  ">
                              
                                    <p>Véhicule : </p>
                                    <p>{form.brand} - {form.model}</p>
                                    <p>Immatriculation : </p>
                                    <p>{form.plateNumber}</p>
                                    <p> Intervention : </p>
                                    <p>
                                        {form.rdvCategory ===
                                        "AtelierP"
                                            ? "Mécanique"
                                            : "Carrosserie"}
                                    </p>
                                    <p>
                                        Travaux : 
                                    </p>
                                    <p>{motifs.find(
                                        (motif) =>
                                            motif.IDMotifRDV === form.task
                                    )?.Motif || "Non défini"}</p>
                                    <p>
                                        Devis :
                                    </p>
                                    <p> {form.chiffrage ? "Oui" : "Non"}</p>
                                    <p>
                                        Prêt : 
                                    </p>
                                    <p>{form.rental ? "Oui" : "Non"}</p>
                                    {#if form.rental}
                                        <p>
                                            Type de location : 
                                        </p>
                                        <p>{form.rentalCategory === "eco" ? "Eco" : "Standard"}</p>
                                        <p>
                                            Transmission : 
                                        </p>
                                        <p>{form.rentalDrive === "manual" ? "Manuelle" : "Automatique"}</p>
                                    {/if}
                                    <p>
                                        Date du RDV : 
                                    </p>
                                    <p>{new Date(form.appointmentDate).toLocaleDateString("fr-FR")} - {form.appointmentTime}</p>
                                    <p>
                                        Type de dépot : 
                                    </p>
                                    <p>{form.contactless
                                        ? "Sans contact"
                                        : "Sur horaires d'ouverture"}</p>
                               
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2"
                >
                    <button type="submit" class="btn btn-success" 
                        >Je valide ce rendez-vous</button
                    >
                    <button type="button" class="btn" {onclick}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
</div>
