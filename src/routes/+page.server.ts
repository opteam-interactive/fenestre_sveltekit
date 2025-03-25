import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/utils/zod';
import { type Infer, message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
type Message = { status: 'error' | 'success' | 'warning'; text: string };


// Initialize superforms
export const load = async () => {
    const form = await superValidate<Infer<typeof loginSchema>, Message>(zod(loginSchema));
    return { form };
};

//POST_ACTION
export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(loginSchema));
        console.log(form);

        if (!form.valid) {
            // Return { form } and things will just work.
            return message(form, {
                status: 'error',
                text: 'Connexion echouee !'
            });

        }

        // TODO: Do something with the validated form.data

        // Return the form with a status message
        return message(form, {
            status: 'success',
            text: 'Connexion reussie !'
        });
    }
};