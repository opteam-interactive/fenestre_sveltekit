import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from './RegisterSchema';
import { type Infer, message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { checkExistingUser, createUser } from '$lib/server/services/userServices';
import { sendRegisterEmail } from '$lib/server/email/UserEmail';
import {error}  from '@sveltejs/kit';
type Message = { status: 'error' | 'success' | 'warning'; text: string };


// Initialize superforms
export const load = async () => {
    const form = await superValidate<Infer<typeof registerSchema>, Message>(zod(registerSchema));
    return { form };
};

//POST_ACTION
export const actions = {
    default: async ({ request }) => {
        
        //Validate on the client
        const form = await superValidate(request, zod(registerSchema));
        if (!form.valid) {
            return fail(400, { form });
        }


        try {
            const existingUser = await checkExistingUser(form.data.email);
            if (existingUser) {
                console.error("L'utilisateur existe deja");
                return message(form, "L'utilisateur existe deja", {status : 400});
            }
            const response = await createUser(form.data)

            if (!response.success) {
                return message(form,"Une erreur est survenue lors de l'inscription", {status : 400});
            }


            const emailResponse = await sendRegisterEmail(form.data)

            if (!emailResponse.success) {
                return message(form, "Erreur dans l'envoi de l'email", {status : 400});
            }
            // Return the form with a status message
            return message(form, "Inscription effectuée !");

        } catch (err) {
            console.error(err);
            throw error(500, "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
        }


        // redirect(303, "/espace-client");

    }
};