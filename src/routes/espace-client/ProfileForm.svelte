<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";
    import { page } from "$app/state";
    import type { PageData } from "./$types";
    import type { ProfileSchemaType } from "./profileSchema";
    import InputText from "$lib/components/forms/InputText.svelte";
    import InputRadio from "$lib/components/forms/InputRadio.svelte";
    import InputCheckbox from "$lib/components/forms/InputCheckbox.svelte";

    const pageData = page.data as PageData;

    // Get logged user from data of the layout
    const { form, errors, constraints, message, enhance } =
        superForm<ProfileSchemaType>(pageData.form, {
            invalidateAll: "force",
        });
</script>

{#if $message}
    <h3
        class={$message.status == "success" ? "text-green-400" : "text-red-400"}
    >
        {$message.text}
    </h3>
{/if}

<form method="POST" action="?/updateUser" use:enhance class="w-full md-px-8">
    <fieldset class="fieldset gap-4">
        <!-- Email -->
        <InputText
            label="Email"
            placeholder="Ex: example@domain.com"
            name="email"
            type="email"
            bind:value={$form.email}
            fieldError={$errors.email}
            {...$constraints.email}
        />

        <!-- Mot de passe -->
        <div class="grid md:grid-cols-2 gap-4 md-gap-8 items-center">
          
            <!-- MDP -->
            <InputText
                label="Mot de passe"
                type="password"
                placeholder="xxxxxxxx"
                name="password"
                bind:value={$form.password}
                fieldError={$errors.password}
                {...$constraints.password}
            />

            <!-- Confirm -->
            <InputText
                label="Confirmation du mot de passe"
                  type="password"
                placeholder="SARL xxxxx"
                name="passwordConfirm"
                bind:value={$form.passwordConfirm}
                fieldError={$errors.passwordConfirm}
                {...$constraints.passwordConfirm}

            />
        </div>

        <!-- Category -->

        <label for="category" class="fieldset-label text-info"
            >Type de compte</label
        >

        <div class="grid md:grid-cols-2 gap-4 md-gap-8 items-center">
            <div>
                <InputCheckbox
                    label="Je représente une société"
                    name="isSociete"
                    bind:checked={$form.isSociete}
                    fieldError={$errors.isSociete}
                />
            </div>

            <!-- SOCIETE -->

            <InputText
                label="Nom de la societe"
                placeholder="SARL xxxxx"
                name="societe"
                bind:value={$form.societe}
                fieldError={$errors.societe}
                {...$constraints.societe}
                disabled={!$form.isSociete}
            />
        </div>

        <div class="grid md:grid-cols-2 gap-4 md-gap-8 items-end">
            <!-- NOM -->
            <InputText
                label="Nom"
                placeholder="Ex: Dupont"
                name="lastName"
                bind:value={$form.lastName}
                fieldError={$errors.lastName}
                {...$constraints.lastName}
            />

            <InputText
                label="Prénom"
                placeholder="Ex: Eric"
                name="firstName"
                bind:value={$form.firstName}
                fieldError={$errors.firstName}
                {...$constraints.firstName}
            />
        </div>

        <!-- TELEPHONE -->
        <InputText
            label="Téléphone"
            placeholder="Ex: 02 00 00 00 00"
            name="telephone"
            bind:value={$form.telephone}
            fieldError={$errors.telephone}
            {...$constraints.telephone}
        />

        <!-- ADRESSE -->
        <InputText
            label="Adresse"
            placeholder="Ex: 12 rue des Lilas"
            name="address"
            bind:value={$form.address}
            fieldError={$errors.address}
            {...$constraints.address}
        />

        <div class="grid md:grid-cols-2 gap-4 md-gap-8 items-end">
            <!-- CODE_POSTAL -->
            <InputText
                label="Code Postal"
                placeholder="Ex: 76600"
                name="zipcode"
                bind:value={$form.zipcode}
                fieldError={$errors.zipcode}
                {...$constraints.zipcode}
            />

            <!-- Ville -->
            <InputText
                label="Ville"
                placeholder="Ex: Le Havre"
                name="city"
                bind:value={$form.city}
                fieldError={$errors.city}
                {...$constraints.city}
            />
        </div>

        <button class="btn btn-info mt-4 rounded-full"
            >Mettre à jour mon compte</button
        >
    </fieldset>
</form>
<SuperDebug data={$form} />
