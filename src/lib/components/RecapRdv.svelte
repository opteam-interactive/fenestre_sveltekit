<script lang="ts">
    import type { rdvSchemaType } from "$routes/espace-client/prendre-rdv/rdvSchema";
    import type { Motif } from "$lib/types/types";

    type Props = {
        onclick: () => void;
        afterSubmit: () => void;
        form: rdvSchemaType;
        motifs: Motif[];
        motifQuestions: { [key: string]: string };
    }
    const {
        onclick,
        afterSubmit,
        form,
        motifs,
        motifQuestions
    }: Props = $props();
</script>

<div
class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all "
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
            <div class="mt-2 text-base grid grid-cols-2 gap-2  ">
              
                    <p>Véhicule : </p>
                    <p>{form.brand} - {form.model}</p>
                    <p>Immatriculation : </p>
                    <p>{form.plateNumber}</p>
                    <p>Kilométrage : </p>
                    <p>{form.kilometers}</p>
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
                            motif.IDMotifRDV === form.motifId
                    )?.Motif || "Non défini"}</p>

                    <p>Précisions :</p>
                    {#if motifQuestions && Object.keys(motifQuestions).length > 0}
                    <div>
                        <ul>
                            {#each Object.entries(motifQuestions) as [key, value]}
                                <li><span class="font-semibold">{key}</span> : {value}</li>
                            {/each}
                        </ul>
                    </div>
                    {:else}
                    <p>Aucune</p>
                    {/if}
                    
            
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
                        Type de dépot : 
                    </p>
                    <p>{form.contactless
                        ? "Sans contact"
                        : "Sur horaires d'ouverture"}</p>

                    {#if form.contactless === "false"}
                    <p>
                        Date du RDV : 
                    </p>
                    <p>{new Date(form.appointmentDate).toLocaleDateString("fr-FR")} - {form.appointmentTime}</p>
                    {/if}
                   
                   
               
            </div>
        </div>
    </div>
</div>

</div>
<div
    class="flex justify-center"
>
    <button type="submit" class="btn btn-success" onclick={afterSubmit}
        >Je valide ce rendez-vous</button
    >
  
</div>