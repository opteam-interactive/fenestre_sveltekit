<script lang="ts">
import FormWrapper from "$lib/components/FormWrapper.svelte";
import RdvForm from "./RdvForm.svelte";

let { data } = $props();

</script>

<section class="flex flex-col items-center gap-4 p-12">

    <div class="text-center">

        <h1 class="mb-2 uppercase font-terminaBold text-customblue">Prendre un RDV...</h1>
        <h2 class="font-semibold text-customyellow">Attention, si vous avez plusieurs travaux à effectuer, <br />
            merci de nous contacter au 02 35 46 03 70.</h2>
    </div>

    <FormWrapper title='Votre RDV' customClass='md:w-2/3 lg:w-1/2 my-8'>
        <RdvForm formProps={data.form} motifs={data.motifs}/>
    </FormWrapper>


</section>