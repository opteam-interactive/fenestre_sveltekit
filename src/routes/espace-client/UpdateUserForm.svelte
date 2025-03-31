<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";
    import type { User, WebdevUser } from "$lib/types/types";
    import { page } from "$app/state";

    const { form, errors, constraints, message, enhance } = superForm<User>(
        page.data.form
    );
</script>

{#if $message}
    <h3
        class={$message.status == "success" ? "text-green-400" : "text-red-400"}
    >
        {$message.text}
    </h3>
{/if}

<form action="?/register" method="POST" use:enhance class="w-full px-8">
    <fieldset class="fieldset gap-4">
        <!-- Email -->
        <div>
            <label class="fieldset-label text-info" for="email">Email</label>
            <input
                type="email"
                class="input w-full rounded-full"
                placeholder="Email"
                name="email"
                bind:value={$form.email}
                {...$constraints.email}
                aria-invalid={$errors.email ? "true" : undefined}
            />
            {#if $errors.email}
                <span class="invalid">{$errors.email}</span>
            {/if}
        </div>

        <!-- PASSWORD -->
        <div class="grid grid-cols-2 gap-8 items-end">
            <div>
                <label class="fieldset-label text-info" for="password"
                    >Mot de passe</label
                >
                <input
                    type="password"
                    class="input w-full rounded-full"
                    placeholder=""
                    name="password"
                    bind:value={$form.password}
                    {...$constraints.password}
                    aria-invalid={$errors.password ? "true" : undefined}
                />
                {#if $errors.password}
                    <span class="invalid">{$errors.password}</span>
                {/if}
            </div>

            <!-- SOCIETE -->
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

<style>
</style>
