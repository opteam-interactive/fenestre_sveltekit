import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './LoginSchema';
import { redirect } from '@sveltejs/kit';
import { login } from '$lib/server/services/authServices';
import { fail } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
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

        try {

            if (!form.valid) {
                return fail(400, { form });
            }

            const response = await login(form.data.userName, form.data.password, cookies)

            if (!response.success) {
                return message(form, response.error, {
                    status: 400
                });
            }


            // If you ever need to return instead of redirect
            // return message(form, {
            //     status: "success",
            //     text: "Connexion réussie !"
            // });
            // If all successful, redirect


        } catch (err) {
            console.error(err);
            throw error(400, "Une erreur est survenue lors de l'action login. Veuillez réessayer.");
        }

        return redirect(302, '/espace-client');
    }
};