<script lang="ts">
    import InputText from "$lib/components/forms/InputText.svelte";
    import { superForm } from "sveltekit-superforms";
    import SuperDebug from "sveltekit-superforms";
    import { page } from "$app/state";

    import type { PageData } from "./$types";
    import type { LoginSchematype } from "./LoginSchema";
    import FormFeedback from "$lib/components/forms/FormFeedback.svelte";

    const pageData = page.data as PageData;
    const { form, errors, constraints, message, enhance } = superForm<LoginSchematype>(pageData.form);

        $effect(() => {
            console.log("form", $form)
            console.log("errors", $errors)
            console.log("message", $message)
        })

    
</script>

<!-- <LoginForm /> -->

<FormFeedback message={$message } />


<form method="POST" use:enhance class="w-full px-8">
    <fieldset class="fieldset gap-4">
            <InputText
            label="Nom d'utilisateur"
            name="userName"
            placeholder="Identifiant"
            bind:value={$form.userName}
            fieldError={$errors.userName}
            {...$constraints.userName}
            />
          
        

        <InputText
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="Mot de passe"
            bind:value={$form.password}
            fieldError={$errors.password}
            {...$constraints.password}
        />
       

        <button type="submit" class="btn btn-info mt-4 rounded-full">Login</button>
    </fieldset>

</form>
