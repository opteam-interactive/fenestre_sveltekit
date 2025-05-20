<script lang="ts">
    import FormWrapper from "$lib/components/FormWrapper.svelte";
    import TitleBanner from "$lib/components/sections/TitleBanner.svelte";
    import ProfileForm from "./ProfileForm.svelte";
</script>

<TitleBanner
    title="Votre Espace"
    subtitle="Attention, si vous avez plusieurs travaux à effectuer, merci de nous contacter au 02 35 46 03 70."
/>

<FormWrapper
    title="Je gère mon compte"
    customClass="w-full md:w-2/3 lg:w-1/2 my-8"
>
    <ProfileForm />
    
</FormWrapper>
