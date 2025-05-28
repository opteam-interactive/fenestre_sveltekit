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
    import type {
        FormattedResponse,
        Timeslot,
        TimeSlotResponse,
    } from "$lib/types/types";
    import type { rdvSchemaType } from "./rdvSchema";
    import FormWrapper from "$lib/components/FormWrapper.svelte";
    import RecapRdv from "$lib/components/RecapRdv.svelte";

    //DATA & states
    //_Get data fetched at the page level (page.server.ts
    const pageData = page.data as PageData;
    const { form, errors, constraints, message, enhance, submitting } =
        superForm<rdvSchemaType>(pageData.form);
    const motifs = pageData.motifs;
    const filteredMotifs = $derived(
        motifs.filter((motif) => motif.NomActivité.includes($form.rdvCategory))
    );
    const forfait = pageData.forfait;
    //Setup superform object

    //Utility states
    let formStep = $state(1);
    let selectedMotifId = $state(0);
    let isModalVisible = $state(false);
    let selectedDay = $state(new Date());
    let capacityFullError = $state<string>("");
    let selectedMotifQuestions = $derived(
        motifQuestions.filter(
            (question) => question.idMotifRDV === $form.motifId
        )
    );
    let finalMotifQuestions = $state<{ [slug: string]: string }>({}); //stores all the complementary info for the selected motif
    let finalMotifQuestionsString = $derived(
        JSON.stringify(finalMotifQuestions)
    );

    $effect(() => {
        if ($form && !submitting) {
            const currentMotifDetailsString =
                JSON.stringify(finalMotifQuestions);

            //if the motif has changed reset the final motif questions
            if ($form.motifId !== selectedMotifId) {
                console.log("motif changed");
                selectedMotifId = $form.motifId;
                finalMotifQuestions = {};
            }

            // Only update if the stringified value has actually changed
            if ($form.motifDetails !== currentMotifDetailsString) {
                $form.motifDetails = currentMotifDetailsString;
            }
        }
    });

    $effect(() => {
        if (selectedDay !== $form.appointmentDate) {
            selectedDay = $form.appointmentDate;
            $form.appointmentTime = "";
            capacityFullError = "";
        }
    });

    //METHODS

    //When form is submitted
    const afterSubmit = () => {
        setTimeout(() => {
            isModalVisible = false;
        }, 500);
        goto("#top");
        // alert("Rendez-vous réservé avec succès");
    };

    const nextStep = () => {
        if (formStep < 5) {
            formStep += 1;
        }
    }

    const prevStep = () => {
        if (formStep > 1) {
            formStep -= 1;
        }
    }

    const fetchAvailableTimeSlots = async () => {
        if ($form.appointmentDate) {
            const remainingTimeSlotsResponse = await fetch(
                `${PUBLIC_SITE_URL}/api/rdv/filter/${$form.appointmentDate}/${$form.rdvCategory}`
            );
            const jsonResponse: FormattedResponse<TimeSlotResponse> =
                await remainingTimeSlotsResponse.json();

            if (!jsonResponse.success) {
                console.error(jsonResponse.error);
                return [];
            }

            const remainingTimeSlots = jsonResponse.data?.availableSlots;
            const remainingCapacityAtelierP =
                jsonResponse.data?.remainingCapacityAtelierP;
            const remainingCapacityAtelierM =
                jsonResponse.data?.remainingCapacityCarrosserieP;
            console.log("remainingTimeSlots", remainingTimeSlots);
            console.log("remainingCapacityAtelierP", remainingCapacityAtelierP);
            console.log("remainingCapacityAtelierM", remainingCapacityAtelierM);

            if (!remainingTimeSlots || remainingTimeSlots.length <= 0) {
                return [];
            } else if (
                $form.rdvCategory === "AtelierP" &&
                remainingCapacityAtelierP &&
                remainingCapacityAtelierP <= 0
            ) {
                capacityFullError =
                    "Tous les créneaux ateliers sont réservés pour ce jour, merci de choisir un autre jour";

                return [];
            } else if (
                $form.rdvCategory === "CarrosserieP" &&
                remainingCapacityAtelierM &&
                remainingCapacityAtelierM <= 0
            ) {
                capacityFullError =
                    "Tous les créneaux carrosseries sont réservés pour ce jour, merci de choisir un autre jour";
                return [];
            } else {
                return remainingTimeSlots;
            }
        }
    };
    let availableTimeSlots = $derived(fetchAvailableTimeSlots());
</script>

<div class="mt-6">
    <ul class="steps text-sm">
        <button class={formStep === 1 ? "step step-info" : "step"} onclick={() => (formStep = 1)}>
            Infos personnelles
        </button>
        <button class={formStep === 2 ? "step step-info" : "step"} onclick={() => (formStep = 2)}>Motif du rdv</button>
        <button class={formStep === 3 ? "step step-info" : "step"} onclick={() => (formStep = 3)}>
            Devis et prêt
        </button>
        <button class={formStep === 4 ? "step step-info" : "step"} onclick={() => (formStep = 4)}>
            Dépôt du véhicule
        </button>
        <button class={formStep === 5 ? "step step-info" : "step"} onclick={() => (formStep = 5)}>
            Récapitulatif
        </button>
    </ul>
</div>


<FormWrapper  customClass="md:w-2/3 lg:w-1/2 my-8">

    <FormFeedback message={$message} />

    <form method="POST" use:enhance class="w-full md-px-8">


        {#if formStep === 1}
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
            </fieldset>


        {:else if formStep === 2}
            <fieldset class="fieldset gap-8">
                <div>
                    <h3 class="text-center text-customblue">
                        Type d'intervention
                    </h3>
                    <div class="tabs tabs-box w-1/2 mx-auto">
                        <input
                            type="radio"
                            name="rdvCategory"
                            class="tab w-1/2 text-white hover:text-white [--tab-bg:#00549E] [--tab-border-color:white]"
                            aria-label="Atelier"
                            value="AtelierP"
                            bind:group={$form.rdvCategory}
                        />

                        <input
                            type="radio"
                            name="rdvCategory"
                            class="tab w-1/2 text-white hover:text-white [--tab-bg:#00549E] [--tab-border-color:white]"
                            aria-label="Carrosserie"
                            value="CarrosserieP"
                            bind:group={$form.rdvCategory}
                        />
                    </div>
                </div>
                <!-- Motif de RDV -->
                <InputSelect
                    label="Motif du rendez-vous"
                    placeholder="Motif du rendez-vous"
                    name="motifId"
                    bind:value={$form.motifId}
                    fieldError={$errors.motifId}
                >
                    {#each filteredMotifs as motif}
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
                                    bind:value={
                                        finalMotifQuestions[question.label]
                                    }
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
                <input
                    type="hidden"
                    name="motifDetails"
                    bind:value={finalMotifQuestionsString}
                />
            </fieldset>


        {:else if formStep === 3}
            <fieldset class="fieldset gap-8">
                <!-- CHIFFRAGE_? -->
                <InputCheckbox
                    label="Je souhaite un devis"
                    name="chiffrage"
                    id="1"
                    bind:checked={$form.chiffrage}
                    fieldError={$errors.chiffrage}
                />

                <InputCheckbox
                    label="Je souhaite un prêt de voiture"
                    name="rental"
                    id="2"
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
            </fieldset>


        {:else if formStep === 4}
            <fieldset class="fieldset gap-8">
                <!-- Depot du vehicule -->
                <RadioWrapper
                    label="Dépôt du véhicule"
                    error={$errors.contactless}
                >
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
                        <label
                            class="fieldset-label text-info"
                            for="appointmentDate">Date du RDV</label
                        >
                        <Pikaday
                            bind:value={$form.appointmentDate}
                            name="appointmentDate"
                            ariaInvalid={$errors.plateNumber
                                ? "true"
                                : undefined}
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
                                    <option disabled
                                        >Aucun créneau disponible</option
                                    >
                                {/if}
                            {:catch reason}
                                <span>Oops! - {reason}</span>
                            {/await}
                        </InputSelect>
                    {/if}
                {:else}
                    <div role="alert" class="alert alert-warning">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <span>
                            Pour les dépôts sans contact, nous vous
                            recontacterons par SMS pour convenir des détails</span
                        >
                    </div>
                {/if}
            </fieldset>

            
        {:else if formStep === 5}
            <fieldset class="fieldset gap-8">
                <!-- MODAL_DE_VALIDATION -->
               
                    <RecapRdv
                        onclick={() => (isModalVisible = !isModalVisible)}
                        form={$form}
                        motifQuestions={finalMotifQuestions}
                        {motifs}
                        {afterSubmit}
                    />
              
            </fieldset>
        {/if}
    </form>
    <div class="grid grid-cols-2 gap-4">
        <button class={formStep === 1 ? "btn btn-disabled" : "btn"} onclick={prevStep}>Précédent</button>
        <button class={formStep === 5 ? "btn btn-disabled" : "btn"} onclick={nextStep}>Suivant</button>
    </div>
</FormWrapper>
<SuperDebug data={$form} />
