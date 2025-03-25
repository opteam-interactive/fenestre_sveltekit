<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";

    const { formProps } = $props();

    // Client API:
    const { form, errors, constraints, message, enhance } =
        superForm(formProps);
</script>

<!-- <LoginForm /> -->

{#if $message}
    <h3
        class={$message.status == "success" ? "text-green-400" : "text-red-400"}
    >
        {$message.text}
    </h3>
{/if}

<form method="POST" use:enhance class="w-full px-8">
    <fieldset class="fieldset">
        <div>
            <label class="fieldset-label" for="userName">Nom d'utilisateur</label>
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
            <label class="fieldset-label" for="password">Mot de passe</label>
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

        <button class="btn btn-info mt-4 rounded-full">Login</button>
    </fieldset>
    <SuperDebug data={$form} />
</form>
