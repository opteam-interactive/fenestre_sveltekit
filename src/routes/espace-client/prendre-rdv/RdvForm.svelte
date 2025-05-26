<script lang="ts">
    //Superforms
    import { setError, superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";
    import { page } from "$app/state";
    //Utils
    import { slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { PUBLIC_SITE_URL } from "$env/static/public";
    import { motifQuestions } from "$lib/client/constants";

    //Form components
    import RadioWrapper from "$lib/components/forms/RadioWrapper.svelte";
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
    import type { PageData } from "./$types";
    import type { FormattedResponse, Timeslot } from "$lib/types/types";
    import type { rdvSchemaType } from "./rdvSchema";

    //METHODS
    const fetchAvailableTimeSlots = async () => {
        if ($form.appointmentDate) {
            const remainingTimeSlotsResponse = await fetch(
                `${PUBLIC_SITE_URL}/api/rdv/filter/${$form.appointmentDate}`
            );
            const jsonResponse: FormattedResponse<Timeslot[]> =
                await remainingTimeSlotsResponse.json();

            if (!jsonResponse.success && jsonResponse.error) {
                console.error(jsonResponse.error);
                capacityFullError = jsonResponse.error;
                return [];
            }
            const remainingTimeSlots = jsonResponse.data;
            if (remainingTimeSlots) {
                return remainingTimeSlots;
            } else {
                return [];
            }
        }
    };

    //DATA & states
    //_Get data fetched at the page level (page.server.ts)
    const pageData = page.data as PageData;
    const motifs = pageData.motifs;
    const forfait = pageData.forfait;
    //Setup superform object
    const { form, errors, constraints, message, enhance } =
        superForm<rdvSchemaType>(pageData.form);
    //Utility states
    let isModalVisible = $state(false);
    let selectedDay = $state(new Date());
    let capacityFullError = $state<string>("");
    let availableTimeSlots = $derived(fetchAvailableTimeSlots());
    let selectedMotifQuestions = $derived(
        motifQuestions.filter(
            (question) => question.idMotifRDV === $form.task
        )
    );
    let finalMotifQuestions = $state<{ [slug: string]: string }>({}); //stores all the complementary info for the selected motif

    $effect(() => {
        finalMotifQuestions = {};
        if (selectedDay !== $form.appointmentDate) {
            selectedDay = $form.appointmentDate;
            $form.appointmentTime = "";
            capacityFullError = "";
        }
    });

    //When form is submitted
    const afterSubmit = () => {
        setTimeout(() => {
            isModalVisible = false;
        }, 500);
        goto("#top");
        // alert("Rendez-vous réservé avec succès");
    };

    $inspect(finalMotifQuestions);
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

            <!-- KILOMETRAGE -->
            <InputText
                label="Kilométrage"
                placeholder="Ex: 3000"
                name="kilometers"
                type="number"
                bind:value={$form.kilometers}
                fieldError={$errors.kilometers}
                {...$constraints.kilometers}
            />
        </FormColumns>

        <!-- <InputSelect
            label="Type d'intervention"
            placeholder="Type d'intervention"
            name="rdvCategory"
            bind:value={$form.rdvCategory}
            fieldError={$errors.rdvCategory}
        >
            <option value="AtelierP">Mécanique</option>
            <option value="CarrosserieP">Carrosserie</option>
        </InputSelect> -->

        <!-- Motif de RDV -->
        <InputSelect
            label="Motif du rendez-vous"
            placeholder="Motif du rendez-vous"
            name="task"
            bind:value={$form.task}
            fieldError={$errors.task}
        >
            {#each motifs as motif}
                <option value={motif.IDMotifRDV}>{motif.Motif}</option>
            {/each}
        </InputSelect>

        <!-- Pour ce motif, affiche les différentes questions complémentaires -->
        {#each selectedMotifQuestions as selectedMotifQuestion}
            {#if selectedMotifQuestion.questions}
                <div
                    class="grid grid-cols-2 gap-4 px-8 py-4 bg-white rounded-md"
                    transition:slide
                >
                    {#each selectedMotifQuestion.questions as question}
                        <InputSelect
                            name={question.slug}
                            label={question.label}
                            bind:value={finalMotifQuestions[question.label]}
                        >
                            {#each question.answers as answer}
                                <option value={answer}>{answer}</option>
                            {/each}
                        </InputSelect>
                    {/each}
                </div>
            {/if}
            <!-- Pour ce motif, affiche le champs texte s'il est présent -->
            {#if selectedMotifQuestion.textInput && selectedMotifQuestion.textInputLabel}
                <InputText
                    label={selectedMotifQuestion.textInputLabel}
                    placeholder={selectedMotifQuestion.textInputLabel}
                    name={"notes " + selectedMotifQuestion.Motif}
                    bind:value={finalMotifQuestions["Notes"]}
                />
            {/if}
        {/each}

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
                        label={`Eco (${forfait.journalier}€ + ${forfait.kilometrique}€/km)`}
                        name="rentalCategory"
                        value="eco"
                        bind:group={$form.rentalCategory}
                        fieldError={$errors.rentalCategory}
                    />
                    <InputRadio
                        label={`Standard (35€ + ${forfait.kilometrique}€/km)`}
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

        <!-- Depot du vehicule -->
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

        {#if $form.contactless === "false"}
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
            {#if capacityFullError.length > 0}
                <FieldErrors fieldError={capacityFullError} />
            {:else}
                <InputSelect
                    label="Heure du RDV (créneaux disponibles)"
                    placeholder="Heure du RDV"
                    name="appointmentTime"
                    bind:value={$form.appointmentTime}
                    fieldError={$errors.appointmentTime}
                >
                    {#await availableTimeSlots}
                        <option disabled>Loading data...</option>
                    {:then availableTimeSlots}
                        {#if availableTimeSlots !== undefined}
                            {#each availableTimeSlots as timeSlot}
                                <option value={timeSlot.startHour}
                                    >{timeSlot.startHour}</option
                                >
                            {/each}
                        {:else if availableTimeSlots && availableTimeSlots.length === 0}
                            <option disabled>Aucun créneau disponible</option>
                        {/if}
                    {:catch reason}
                        <span>Oops! - {reason}</span>
                    {/await}
                </InputSelect>
            {/if}
        {:else}
            <p class="text-red-500 text-sm">
                Pour les dépôts sans contact, nous vous recontacterons par SMS
                pour convenir des détails
            </p>
        {/if}

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
                motifQuestions = {finalMotifQuestions}
                {motifs}
                {afterSubmit}
            />
        {/if}
    </fieldset>
</form>

<SuperDebug data={$form} />
