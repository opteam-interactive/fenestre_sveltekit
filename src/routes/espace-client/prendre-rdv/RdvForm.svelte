<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";
    import type { Motif, RendezVous, WebdevRendezVous } from "$lib/utils/types";
    import Pikaday from "../../../lib/components/Pikaday.svelte";
    import { generateTimeSlots } from "$lib/utils/date";
    import { format } from "date-fns";
    import { fetchRdvForDate } from "$lib/utils/date";
    import { slide } from "svelte/transition";
    import ModalRdv from "$lib/components/ModalRdv.svelte";

    let isModalVisible = $state(false);
    const allTimeSlots: string[] = generateTimeSlots(8, 10, 15);

    const { formProps, motifs }: { formProps: any; motifs: Motif[] } = $props();
    const { form, errors, constraints, message, enhance } =
        superForm<RendezVous>(formProps);
    let availableTimeSlots = $state(allTimeSlots);

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

{#if $message}
    <h3
        class={$message.status == "success" ? "text-green-400" : "text-red-400"}
    >
        {$message.text}
    </h3>
{/if}

<form method="POST" use:enhance class="w-full px-8">
    <fieldset class="fieldset gap-8">
        <div class="grid grid-cols-2 gap-8 items-end">
            <!-- MARQUE -->
            <div>
                <label class="fieldset-label text-info" for="brand"
                    >Marque du véhicule</label
                >
                <input
                    type="text"
                    class="input w-full rounded-full"
                    placeholder="Ex: Peugeot"
                    name="brand"
                    bind:value={$form.brand}
                    {...$constraints.brand}
                    aria-invalid={$errors.brand ? "true" : undefined}
                />
                {#if $errors.brand}
                    <span class="invalid">{$errors.brand}</span>
                {/if}
            </div>

            <!-- MODELE -->
            <div>
                <label class="fieldset-label text-info" for="model"
                    >Modèle du véhicule</label
                >
                <input
                    type="text"
                    class="input w-full rounded-full"
                    placeholder="Ex: 206"
                    name="model"
                    bind:value={$form.model}
                    {...$constraints.model}
                    aria-invalid={$errors.model ? "true" : undefined}
                />
                {#if $errors.model}
                    <span class="invalid">{$errors.model}</span>
                {/if}
            </div>
        </div>

        <div class="grid grid-cols-2 gap-8 items-end">
            <!-- IMMATRICULATION -->
            <div>
                <label class="fieldset-label text-info" for="plateNumber"
                    >Immatriculation</label
                >
                <input
                    type="text"
                    class="input w-full rounded-full"
                    placeholder="Ex: 345FC34"
                    name="plateNumber"
                    bind:value={$form.plateNumber}
                    {...$constraints.plateNumber}
                    aria-invalid={$errors.plateNumber ? "true" : undefined}
                />
                {#if $errors.plateNumber}
                    <span class="invalid">{$errors.plateNumber}</span>
                {/if}
            </div>

            <div>
                <label class="fieldset-label text-info" for="plateNumber"
                    >Type d'intervention</label
                >
                <select
                    class="select w-full rounded-full"
                    name="rdvCategory"
                    bind:value={$form.rdvCategory}
                >
                    <option value="AtelierP">Mécanique</option>
                    <option value="CarrosserieP">Carrosserie</option>
                </select>
                {#if $errors.rdvCategory}
                    <span class="invalid">{$errors.rdvCategory}</span>
                {/if}
            </div>
        </div>

        <!-- TRAVAUX -->
        <div>
            <label class="fieldset-label text-info" for="task"
                >Travaux à effectuer</label
            >
            <select
                class="select w-full rounded-full"
                name="task"
                bind:value={$form.task}
            >
                <option disabled selected>Choisir une catégorie</option>

                {#each motifs as motif}
                    {#if motif.NomActivité === $form.rdvCategory}
                        <option value={motif.IDMotifRDV}>{motif.Motif}</option>
                    {/if}
                {/each}
            </select>
            {#if $errors.task}
                <span class="invalid">{$errors.task}</span>
            {/if}
        </div>

        <!-- CHIFFRAGE_? -->

        <div>
            <label class="fieldset-label text-info">
                <input
                    type="checkbox"
                    class="checkbox"
                    name="chiffrage"
                    bind:checked={$form.chiffrage}
                />
                Je souhaite un devis
            </label>
            {#if $errors.chiffrage}
                <span class="invalid">{$errors.chiffrage}</span>
            {/if}
        </div>

        <div>
            <label class="fieldset-label text-info">
                <input
                    type="checkbox"
                    class="checkbox"
                    name="rental"
                    bind:checked={$form.rental}
                />
                Je souhaite un prêt de voiture
            </label>
            {#if $errors.rental}
                <span class="invalid">{$errors.rental}</span>
            {/if}
        </div>

        {#if $form.rental}
            <!-- Type de location -->
            <div class="flex gap-8" transition:slide>
                <div>
                    <label class="fieldset-label text-info" for="category"
                        >Type de location</label
                    >
                    <div class="flex flex-col gap-2">
                        <div>
                            <input
                                type="radio"
                                class="radio radio-sm radio-info"
                                name="rentalCategory"
                                value="eco"
                                bind:group={$form.rentalCategory}
                            />
                            <label for="userCategory"
                                >Eco (5€/jour + 0.22€/km)</label
                            >
                        </div>

                        <div>
                            <input
                                type="radio"
                                class="radio radio-sm radio-info"
                                name="rentalCategory"
                                value="standard"
                                bind:group={$form.rentalCategory}
                            />
                            <label for="userCategory">
                                Standard (35€/jour + 0.22€/km)</label
                            >
                        </div>
                    </div>
                    {#if $errors.rentalCategory}
                        <span class="invalid">{$errors.rentalCategory}</span>
                    {/if}
                </div>

                <!-- Type de transmission -->
                <div>
                    <label class="fieldset-label text-info" for="category"
                        >Transmission</label
                    >
                    <div class="flex flex-col gap-2">
                        <div>
                            <input
                                type="radio"
                                class="radio radio-sm radio-info"
                                name="rentalDrive"
                                value="manual"
                                bind:group={$form.rentalDrive}
                            />
                            <label for="userCategory">Manuelle</label>
                        </div>

                        <div>
                            <input
                                type="radio"
                                class="radio radio-sm radio-info"
                                name="rentalDrive"
                                value="auto"
                                bind:group={$form.rentalDrive}
                            />
                            <label for="userCategory"> Automatique</label>
                        </div>
                    </div>
                    {#if $errors.rentalCategory}
                        <span class="invalid">{$errors.rentalCategory}</span>
                    {/if}
                </div>
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
            {#if $errors.appointmentDate}
                <span class="invalid">{$errors.appointmentDate}</span>
            {/if}
        </div>
        <!-- HEURE_DU_RDV -->
        <div>
            <label class="fieldset-label text-info" for="appointmentTime"
                >Heure du RDV</label
            >
            <select
                class="select w-full rounded-full"
                name="appointmentTime"
                bind:value={$form.appointmentTime}
            >
                <option disabled selected>Choisir une catégorie</option>
                {#each availableTimeSlots as timeSlot}
                    <option value={timeSlot}>{timeSlot}</option>
                {/each}
            </select>
            {#if $errors.appointmentTime}
                <span class="invalid">{$errors.appointmentTime}</span>
            {/if}
        </div>

        <!-- Type de transmission -->
        <div>
            <label class="fieldset-label text-info" for="contactless"
                >Dépôt du véhicule</label
            >
            <div class="flex flex-col gap-2">
                <div>
                    <input
                        type="radio"
                        class="radio radio-sm radio-info"
                        name="contactless"
                        value="true"
                        bind:group={$form.contactless}
                    />
                    <label for="userCategory">Dépôt sans contact</label>
                </div>

                <div>
                    <input
                        type="radio"
                        class="radio radio-sm radio-info"
                        name="contactless"
                        value="false"
                        bind:group={$form.contactless}
                    />
                    <label for="userCategory"
                        >Sur nos horaires d'ouverture</label
                    >
                </div>
            </div>
            {#if $errors.contactless}
                <span class="invalid">{$errors.contactless}</span>
            {/if}
        </div>


        <!-- MODAL_DE_VALIDATION -->
        <button
            type="button"
            class="btn btn-info mt-4 rounded-full"
            onclick={() => (isModalVisible = !isModalVisible)}>Voir le résumé et confirmer</button
        >
        {#if isModalVisible}
          <ModalRdv onclick={() => (isModalVisible = !isModalVisible)} form={$form} motifs={motifs}/>
        {/if}

    </fieldset>
</form>

<SuperDebug data={$form} />
