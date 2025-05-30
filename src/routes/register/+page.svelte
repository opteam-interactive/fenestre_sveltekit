<script lang="ts">
import FormWrapper from "$lib/components/FormWrapper.svelte";
import RegisterForm from "./RegisterForm.svelte";

let { data } = $props();

</script>


<section class="flex flex-col items-center gap-4 p-12">
    <div class="text-center  mb-8 ">
        <h1 class="mb-2 uppercase font-terminaBold text-customblue">Creation de compte</h1>
        <a href='/' class="mb-2  text-customblue">◄ Retour à l'écran de connexion</a>
    </div>
    <FormWrapper customClass='w-1/2'> 
        <RegisterForm formProps={data.form} />
    </FormWrapper>

</section>

<style>

</style>