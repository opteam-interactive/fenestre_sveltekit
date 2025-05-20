<script lang="ts">
    import FormWrapper from "$lib/components/FormWrapper.svelte";
    import TitleBanner from "$lib/components/sections/TitleBanner.svelte";
    import RdvForm from "./RdvForm.svelte";

    let { data } = $props();
</script>

<TitleBanner
    title="Prendre un RDV"
    subtitle="Attention, si vous avez plusieurs travaux à effectuer, merci de nous contacter au 02 35 46 03 70."
/>

<FormWrapper title="Votre RDV" customClass="md:w-2/3 lg:w-1/2 my-8">
    <RdvForm  />
</FormWrapper>
