import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { rdvSchema } from '$lib/utils/zod';
import { type Infer, message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
type Message = { status: 'error' | 'success' | 'warning'; text: string };


// Initialize superforms
export const load = async () => {
    const form = await superValidate<Infer<typeof rdvSchema>, Message>(zod(rdvSchema));
    return { form };
};

//POST_ACTION
export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(rdvSchema));


        if (!form.valid) {
            // Return { form } and things will just work.
            return message(form, {
                status: 'error',
                text: 'La prise de RDV a échoué'
            });

        }

        // TODO: Do something with the validated form.data

        // Return the form with a status message
        return message(form, {
            status: 'success',
            text: 'Prise de RDV reussie !'
        });
    }
};