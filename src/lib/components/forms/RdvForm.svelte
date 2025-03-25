<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";
    import type { RendezVous } from "$lib/utils/types";
    import Pikaday from "../Pikaday.svelte";

    const { formProps } = $props();
    const { form, errors, constraints, message, enhance } =
        superForm<RendezVous>(formProps);
</script>

{#if $message}
    <h3
        class={$message.status == "success" ? "text-green-400" : "text-red-400"}
    >
        {$message.text}
    </h3>
{/if}

<form method="POST" use:enhance class="w-full px-8">
    <fieldset class="fieldset gap-4">
        <div class="grid grid-cols-2 gap-8 items-end">
            <!-- MARQUE -->
            <div>
                <label class="fieldset-label text-info" for="brand"
                    >Marque du véhicule</label
                >
                <input
                    type="text"
                    class="input w-full rounded-full"
                    placeholder="Identifiant"
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
                    placeholder=""
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
                    placeholder=""
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
                    <option disabled selected>Choisir une catégorie</option>
                    <option>Mécanique</option>
                    <option>Carrosserie</option>
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

                <!-- TODO add travaux -->
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
            <div>
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
                            <label for="userCategory">Automatique</label>
                        </div>
                    </div>
                    {#if $errors.rentalDrive}
                        <span class="invalid">{$errors.rentalDrive}</span>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- DATE_DU_RDV -->
        <div>
            <label class="fieldset-label text-info" for="plateNumber"
                >Date du RDV</label
            >
            <input
                type="date"
                class="input w-full rounded-full"
                placeholder=""
                name="plateNumber"
                bind:value={$form.plateNumber}
                {...$constraints.plateNumber}
                aria-invalid={$errors.plateNumber ? "true" : undefined}
            />
            {#if $errors.plateNumber}
                <span class="invalid">{$errors.plateNumber}</span>
            {/if}
        </div>

        <Pikaday field={$form.appointmentDate}/>
















        <div class="grid grid-cols-2 gap-8 items-end">
            <div>
                <label class="fieldset-label text-info" for="category"
                    >Vous êtes...</label
                >
                <div class="flex flex-col gap-2">
                    <div>
                        <input
                            type="radio"
                            class="radio radio-sm radio-info"
                            placeholder="Identifiant"
                            name="category"
                            value="particulier"
                            bind:group={$form.category}
                        />
                        <label for="userCategory">Un particulier</label>
                    </div>

                    <div>
                        <input
                            type="radio"
                            class="radio radio-sm radio-info"
                            placeholder="Identifiant"
                            name="userCategory"
                            value="societe"
                            bind:group={$form.category}
                        />
                        <label for="userCategory">Une entreprise</label>
                    </div>
                </div>
                {#if $errors.category}
                    <span class="invalid">{$errors.category}</span>
                {/if}
            </div>

            <!-- SOCIETE -->
            {#if $form.category == "societe"}
                <div>
                    <label class="fieldset-label text-info" for="societe"
                        >Nom de l'entreprise</label
                    >
                    <input
                        type="text"
                        class="input w-full rounded-full"
                        placeholder="Nom de l'entreprise"
                        name="societe"
                        bind:value={$form.societe}
                        {...$constraints.societe}
                        aria-invalid={$errors.societe ? "true" : undefined}
                    />
                    {#if $errors.societe}
                        <span class="invalid">{$errors.societe}</span>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- NOM -->
        <div class="grid grid-cols-2 gap-8 items-end">
            <div>
                <label class="fieldset-label text-info" for="lastName"
                    >Nom</label
                >
                <input
                    type="text"
                    class="input w-full rounded-full"
                    placeholder="Ex: Dupont"
                    name="lastName"
                    bind:value={$form.lastName}
                    {...$constraints.lastName}
                    aria-invalid={$errors.lastName ? "true" : undefined}
                />
                {#if $errors.lastName}
                    <span class="invalid">{$errors.lastName}</span>
                {/if}
            </div>

            <!-- PRENOM -->
            <div>
                <label class="fieldset-label text-info" for="firstName"
                    >Prénom</label
                >
                <input
                    type="text"
                    class="input w-full rounded-full"
                    placeholder="Ex: Eric"
                    name="firstName"
                    bind:value={$form.firstName}
                    {...$constraints.firstName}
                    aria-invalid={$errors.firstName ? "true" : undefined}
                />
                {#if $errors.firstName}
                    <span class="invalid">{$errors.firstName}</span>
                {/if}
            </div>
        </div>

        <!-- TELEPHONE -->
        <div>
            <label class="fieldset-label text-info" for="telephone"
                >Téléphone</label
            >
            <input
                type="tel"
                class="input w-full rounded-full"
                placeholder="Ex: 02 00 00 00 00"
                name="telephone"
                bind:value={$form.telephone}
                {...$constraints.telephone}
                aria-invalid={$errors.telephone ? "true" : undefined}
            />
            {#if $errors.telephone}
                <span class="invalid">{$errors.telephone}</span>
            {/if}
        </div>

        <!-- ADRESSE -->
        <div>
            <label class="fieldset-label text-info" for="address">Adresse</label
            >
            <input
                type="text"
                class="input w-full rounded-full"
                placeholder="Ex: 12 rue des Lilas"
                name="address"
                bind:value={$form.address}
                {...$constraints.address}
                aria-invalid={$errors.address ? "true" : undefined}
            />
            {#if $errors.address}
                <span class="invalid">{$errors.address}</span>
            {/if}
        </div>

        <div class="grid grid-cols-2 gap-8 items-end">
            <!-- CODE_POSTAL -->
            <div>
                <label class="fieldset-label text-info" for="zipcode"
                    >Code Postal</label
                >
                <input
                    type="text"
                    class="input w-full rounded-full"
                    placeholder="Ex: 76600"
                    name="zipcode"
                    bind:value={$form.zipcode}
                    {...$constraints.zipcode}
                    aria-invalid={$errors.zipcode ? "true" : undefined}
                />
                {#if $errors.zipcode}
                    <span class="invalid">{$errors.zipcode}</span>
                {/if}
            </div>

            <!-- Ville -->
            <div>
                <label class="fieldset-label text-info" for="city">Ville</label>
                <input
                    type="text"
                    class="input w-full rounded-full"
                    placeholder="Ex: Le Havre"
                    name="city"
                    bind:value={$form.city}
                    {...$constraints.city}
                    aria-invalid={$errors.city ? "true" : undefined}
                />
                {#if $errors.city}
                    <span class="invalid">{$errors.city}</span>
                {/if}
            </div>
        </div>

        <button class="btn btn-info mt-4 rounded-full">Créer mon compte</button>
    </fieldset>
</form>

<SuperDebug data={$form} />
