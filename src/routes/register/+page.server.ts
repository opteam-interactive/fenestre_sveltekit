import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/types/zod';
import { type Infer, message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { register } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
type Message = { status: 'error' | 'success' | 'warning'; text: string };


// Initialize superforms
export const load = async () => {
    const form = await superValidate<Infer<typeof userSchema>, Message>(zod(userSchema));
    return { form };
};

//POST_ACTION
export const actions = {
    register: async ({ request }) => {
        console.log("register")
        //Validate on the client
        const form = await superValidate(request, zod(userSchema));


        if (!form.valid) {
            return fail(400, { form });
        }


        try {
            const response = await register(form.data)

            if (!response.success) {
                return message(form, {
                    status: "error",
                    text: response.error // Show the appropriate error message
                });
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            return message(form, {
                status: "error",
                text: "Une erreur est survenue. Veuillez réessayer."
            });
        }

        // Return the form with a status message
        redirect(303, "/espace-client");

    }
};