<script lang="ts">
    //Superforms
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";
    import { page } from "$app/state";

    //Utils
    import { generateTimeSlots } from "$lib/utils/date";
    import { format } from "date-fns";
    import { fetchRdvForDate } from "$lib/utils/date";
    import { slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    //Form components
    import InputText from "$lib/components/forms/InputText.svelte";
    import FormColumns from "$lib/components/forms/FormColumns.svelte";
    import InputSelect from "$lib/components/forms/InputSelect.svelte";
    import InputCheckbox from "$lib/components/forms/InputCheckbox.svelte";
    import InputRadio from "$lib/components/forms/InputRadio.svelte";
    import FieldErrors from "$lib/components/forms/FieldErrors.svelte";
    import FormFeedback from "$lib/components/forms/FormFeedback.svelte";
    import Pikaday from "../../../lib/components/Pikaday.svelte";
    import ModalRdv from "$lib/components/ModalRdv.svelte";

    // Types
    import type { Motif, RendezVous } from "$lib/types/types";
    import RadioWrapper from "$lib/components/forms/RadioWrapper.svelte";

    let isModalVisible = $state(false);
    const allTimeSlots: string[] = generateTimeSlots(8, 10, 15);

    const motifs = page.data.motifs;
    const { form, errors, constraints, message, enhance } =
        superForm<RendezVous>(page.data.form);

    let availableTimeSlots = $state(allTimeSlots);
    const afterSubmit = () => {
        setTimeout(() => {
            isModalVisible = false;
        }, 500);
        goto("#top");
        // alert("Rendez-vous réservé avec succès");
    };

    $effect(() => {
        //On Mount and when date is modified, fetch available time slots
        const fetchAvailableTimeSlots = async () => {
            if ($form.appointmentDate) {
                const remainingTimeSlots = await fetchRdvForDate(
                    allTimeSlots,
                    $form.appointmentDate
                );
                if (remainingTimeSlots) {
                    availableTimeSlots = remainingTimeSlots;
                }
            }
        };
        fetchAvailableTimeSlots();
    });
</script>

<FormFeedback message={$message} />

<form method="POST" use:enhance class="w-full md-px-8">
    <fieldset class="fieldset gap-8">
        <FormColumns>
            <!-- MARQUE -->
            <InputText
                label="Marque du véhicule"
                placeholder="Ex: Peugeot"
                name="brand"
                bind:value={$form.brand}
                fieldError={$errors.brand}
                {...$constraints.brand}
            />
            <!-- MODELE -->
            <InputText
                label="Modèle du véhicule"
                placeholder="Ex: 206"
                name="model"
                bind:value={$form.model}
                fieldError={$errors.model}
                {...$constraints.model}
            />
        </FormColumns>

        <FormColumns>
            <!-- IMMATRICULATION -->

            <InputText
                label="Immatriculation"
                placeholder="Ex: 345FC34"
                name="plateNumber"
                bind:value={$form.plateNumber}
                fieldError={$errors.plateNumber}
                {...$constraints.plateNumber}
            />

            <InputSelect
                label="Type d'intervention"
                placeholder="Type d'intervention"
                name="rdvCategory"
                bind:value={$form.rdvCategory}
                fieldError={$errors.rdvCategory}
            >
                <option value="AtelierP">Mécanique</option>
                <option value="CarrosserieP">Carrosserie</option>
            </InputSelect>
        </FormColumns>

        <!-- TRAVAUX -->
        <InputSelect
            label="Travaux à effectuer"
            placeholder="Travaux à effectuer"
            name="task"
            bind:value={$form.task}
            fieldError={$errors.task}
        >
            {#each motifs as motif}
                {#if motif.NomActivité === $form.rdvCategory}
                    <option value={motif.IDMotifRDV}>{motif.Motif}</option>
                {/if}
            {/each}
        </InputSelect>

        <!-- CHIFFRAGE_? -->
        <InputCheckbox
            label="Je souhaite un devis"
            name="chiffrage"
            bind:checked={$form.chiffrage}
            fieldError={$errors.chiffrage}
        />

        <InputCheckbox
            label="Je souhaite un prêt de voiture"
            name="rental"
            bind:checked={$form.rental}
            fieldError={$errors.rental}
        />

        {#if $form.rental}
            <!-- Type de location -->
            <div class="flex gap-8" transition:slide>
                <RadioWrapper
                    label="Type de location"
                    error={$errors.rentalCategory}
                >
                    <InputRadio
                        label="Eco (5€ + 0.22€/km)"
                        name="rentalCategory"
                        value="eco"
                        bind:group={$form.rentalCategory}
                        fieldError={$errors.rentalCategory}
                    />
                    <InputRadio
                        label="Standard (35€ + 0.22€/km)"
                        name="rentalCategory"
                        value="standard"
                        bind:group={$form.rentalCategory}
                        fieldError={$errors.rentalCategory}
                    />
                </RadioWrapper>

                <!-- Type de transmission -->

                <RadioWrapper
                    label="Boîte de vitesse"
                    error={$errors.rentalDrive}
                >
                    <InputRadio
                        label="Manuelle"
                        name="rentalDrive"
                        value="manual"
                        bind:group={$form.rentalDrive}
                        fieldError={$errors.rentalDrive}
                    />

                    <InputRadio
                        label="Automatique"
                        name="rentalDrive"
                        value="auto"
                        bind:group={$form.rentalDrive}
                        fieldError={$errors.rentalDrive}
                    />
                </RadioWrapper>
            </div>
        {/if}

        <!-- DATE_DU_RDV -->
        <div>
            <label class="fieldset-label text-info" for="plateNumber"
                >Date du RDV</label
            >
            <Pikaday
                bind:value={$form.appointmentDate}
                name="appointmentDate"
                ariaInvalid={$errors.plateNumber ? "true" : undefined}
                {...$constraints.plateNumber}
            />
            <FieldErrors fieldError={$errors.appointmentDate} />
        </div>

        <!-- HEURE_DU_RDV -->
        <InputSelect
            label="Heure du RDV"
            placeholder="Heure du RDV"
            name="appointmentTime"
            bind:value={$form.appointmentTime}
            fieldError={$errors.appointmentTime}
        >
            {#each availableTimeSlots as timeSlot}
                <option value={timeSlot}>{timeSlot}</option>
            {/each}
        </InputSelect>

        <!-- Type de transmission -->

        <RadioWrapper label="Dépôt du véhicule" error={$errors.contactless}>
            <InputRadio
                label="Sur nos horaires d'ouverture"
                name="contactless"
                value="false"
                bind:group={$form.contactless}
                fieldError={$errors.contactless}
            />

            <InputRadio
                label="Sans contact"
                name="contactless"
                value="true"
                bind:group={$form.contactless}
                fieldError={$errors.contactless}
            />
        </RadioWrapper>
        <FieldErrors fieldError={$errors.contactless} />

        <!-- MODAL_DE_VALIDATION -->
        <button
            type="button"
            class="btn btn-info mt-4 rounded-full"
            onclick={() => (isModalVisible = !isModalVisible)}
            >Voir le résumé et confirmer</button
        >
        {#if isModalVisible}
            <ModalRdv
                onclick={() => (isModalVisible = !isModalVisible)}
                form={$form}
                {motifs}
                {afterSubmit}
            />
        {/if}
    </fieldset>
</form>

<SuperDebug data={$form} />
