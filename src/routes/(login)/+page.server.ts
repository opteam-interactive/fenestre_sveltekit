import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './LoginSchema';
import { redirect } from '@sveltejs/kit';
import { login } from '$lib/server/auth.js';
import { fail } from '@sveltejs/kit';

import { type Infer, message } from 'sveltekit-superforms';


type Message = { status: 'error' | 'success' | 'warning'; text: string };


// Initialize superforms
export const load = async () => {
    const form = await superValidate<Infer<typeof loginSchema>, Message>(zod(loginSchema));
    return { form };
};

//POST_ACTION
export const actions = {

    default: async ({ request, cookies }) => {

        const form = await superValidate(request, zod(loginSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const loginValidation = loginSchema.safeParse(form.data)
            if (!loginValidation.success) {
                return fail(400, { form });
            }
            const response = await login(form.data.userName, form.data.password, cookies)


            if (!response.success) {
                return message(form, {
                    status: "error",
                    text: response.error // Show the appropriate error message
                });
            }

            // If you ever need to return instead of redirect
            // return message(form, {
            //     status: "success",
            //     text: "Connexion réussie !"
            // });

        } catch (error) {
            console.error("Unexpected error:", error);
            return message(form, {
                status: "error",
                text: "Une erreur est survenue. Veuillez réessayer."
            });
        }

        // If all successful, redirect
        redirect(303, "/espace-client");


    }
};