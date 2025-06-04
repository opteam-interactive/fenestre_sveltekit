import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from './RegisterSchema';
import { type Infer, message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { createUser } from '$lib/server/services/userServices';
import { sendRegisterEmail } from '$lib/server/email/UserEmail';
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
            const response = await createUser(form.data)

            if (!response.success) {
                return message(form, {
                    status: "error",
                    text: response.errors // Show the appropriate error message
                });
            }


            const emailResponse = await sendRegisterEmail(form.data)

            if (!emailResponse.success) {
                return message(form, {
                    status: "Erreur dans l'envoi de l'email",
                    text: emailResponse.error // Show the appropriate error message
                });
            }
            // Return the form with a status message
            return message(form, {
                status: "success",
                text: "Inscription effectuée, un email de confirmation vous a été envoyé !"
            })

        } catch (error) {
            console.error("Unexpected error:", error);
            return message(form, {
                status: "error",
                text: "Une erreur est survenue. Veuillez réessayer."
            });
        }


        // redirect(303, "/espace-client");

    }
};