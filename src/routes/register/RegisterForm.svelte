<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";
    import { page } from "$app/state";
    import type { RegisterSchemaType } from "./RegisterSchema";
    import InputText from "$lib/components/forms/InputText.svelte";
    import InputCheckbox from "$lib/components/forms/InputCheckbox.svelte";
    import FormColumns from "$lib/components/forms/FormColumns.svelte";
    import FormSection from "$lib/components/forms/FormSection.svelte";
    import FormToast from "$lib/components/forms/FormToast.svelte";
    import FormFeedback from "$lib/components/forms/FormFeedback.svelte";

    const { form, errors, constraints, message, enhance } =
        superForm<RegisterSchemaType>(page.data.form);

            $effect(() => {
                console.log($message)
            })
</script>
<FormFeedback message={$message} status={page.status}/>



<form method="POST" class="w-full px-8" use:enhance>
    <fieldset class="fieldset gap-4">
        <FormSection title="Informations de connexion">
            <!-- Email -->
            <div class="pb-4">
                <InputText
                    label="Email"
                    placeholder="Ex: example@domain.com"
                    name="email"
                    type="email"
                    bind:value={$form.email}
                    fieldError={$errors.email}
                    {...$constraints.email}
                />
            </div>

            <FormColumns>
                <!-- PASSWORD -->
                <InputText
                    label="Mot de passe"
                    type="password"
                    placeholder="xxxxxxxx"
                    name="password"
                    bind:value={$form.password}
                    fieldError={$errors.password}
                    {...$constraints.password}
                />

                <!-- PASSWORD CONFIRM -->
                <InputText
                    label="Confirmation du mot de passe"
                    type="password"
                    placeholder="xxxxxxxx"
                    name="passwordConfirm"
                    bind:value={$form.passwordConfirm}
                    fieldError={$errors.passwordConfirm}
                    {...$constraints.passwordConfirm}
                />
            </FormColumns>
        </FormSection>

        <FormSection title="Informations personnelles">
            <!-- Category -->

            <label for="category" class="fieldset-label text-info"
                >Type de compte</label
            >

            <FormColumns>
                <InputCheckbox
                    id="isSociete"
                    label="Je représente une société"
                    name="isSociete"
                    bind:checked={$form.isSociete}
                    fieldError={$errors.isSociete}
                />

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
            </FormColumns>
        </FormSection>

        <FormSection title="Coordonnées">
            <FormColumns>
                <!-- TELEPHONE -->
                <InputText
                    label="Téléphone"
                    placeholder="Ex: 02xxxxxxxx"
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
            </FormColumns>
        </FormSection>

        <button class="btn btn-info mt-4 rounded-full">Créer mon compte</button>
    </fieldset>
</form>

<FormToast message={$message} status={page.status} />

<!-- <SuperDebug data={$form} /> -->

<style>
</style>
