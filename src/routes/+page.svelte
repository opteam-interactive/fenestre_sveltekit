<script lang="ts">
    import logo from "$lib/assets/images/logo_peugeot.png";
    import LoginForm from "./LoginForm.svelte";
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";

    let { data } = $props();
    // Client API:
    const { form, errors, constraints, message, enhance } = superForm(data.form);
   
</script>

<div>
    <section class="flex flex-col items-center justify-center gap-4 p-12">
        <img src={logo} alt="" class="w-32" />
        <div class="text-center">
            <h1 class="mb-2 uppercase font-termina">Votre Garage</h1>
            <h2 class="uppercase font-terminaBold text-lightblue2">
                Benoist Fenestre
            </h2>
        </div>
        <div
            class="flex flex-col items-center w-1/3 gap-4 py-4 shadow-lg rounded-xl bg-lightblue"
        >
            <h3 class="font-semibold">Connexion à votre espace</h3>

            <!-- <LoginForm /> -->

            {#if $message}
                <h3
                    class={$message.status == "success"
                        ? "text-green-400"
                        : "text-red-400"}
                >
                    {$message.text}
                </h3>
            {/if}

            <form method="POST" use:enhance class="w-full px-8">
                <fieldset class="fieldset gap-4">
                    <div>
                        <label class="fieldset-label" for="userName"
                            >Nom d'utilisateur</label
                        >
                        <input
                            type="text"
                            class="input w-full rounded-full"
                            placeholder="Identifiant"
                            name="userName"
                            bind:value={$form.userName}
                            {...$constraints.userName}
                            aria-invalid={$errors.userName ? "true" : undefined}
                        />
                        {#if $errors.userName}
                            <span class="invalid">{$errors.userName}</span>
                        {/if}
                    </div>

                    <div>
                        <label class="fieldset-label" for="password"
                            >Mot de passe</label
                        >
                        <input
                            type="password"
                            class="input w-full rounded-full"
                            placeholder="Mot de passe"
                            name="password"
                            bind:value={$form.password}
                            {...$constraints.password}
                            aria-invalid={$errors.password ? "true" : undefined}
                        />
                        {#if $errors.userName}
                            <span class="invalid">{$errors.userName}</span>
                        {/if}
                    </div>

                    <button class="btn btn-info mt-4 rounded-full">Login</button
                    >
                </fieldset>
                <!-- <SuperDebug data={$form} /> -->
            </form>
        </div>
        <a href="/register" class="btn btn-success w-64 mt-4 rounded-full"
            >Créer un compte
        </a>
    </section>
</div>

<style>
</style>
