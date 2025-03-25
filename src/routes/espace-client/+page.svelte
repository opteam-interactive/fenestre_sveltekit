<script lang="ts">
    import FormWrapper from "$lib/components/FormWrapper.svelte";
    import RegisterForm from "$lib/components/forms/RegisterForm.svelte";

    let { data } = $props();

</script>

<section class="flex flex-col items-center gap-4 p-12">
    <div class="text-center">
        <h1 class="mb-2 uppercase font-terminaBold text-customblue">
            Votre Espace
        </h1>
        <h2 class="font-semibold text-customyellow">
            Attention, si vous avez plusieurs travaux à effectuer, <br />
            merci de nous contacter au 02 35 46 03 70.
        </h2>
    </div>
    <FormWrapper title="Je gère mon compte" customClass="md:2/3 lg:w-1/2 my-8">
         <RegisterForm formProps={data.form}/> 
    </FormWrapper>
</section>

<style>
</style>
