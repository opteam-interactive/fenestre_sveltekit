<script lang="ts">
    import logo from "$lib/assets/images/logo_peugeot.png";
    import LoginForm from "$lib/components/forms/LoginForm.svelte";

    let { data } = $props();
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

            <LoginForm formProps={data.form} />

        </div>
        <button class="btn btn-success w-64 mt-4 rounded-full"
            >Créer un compte
        </button>
    </section>
</div>

<style>
</style>
