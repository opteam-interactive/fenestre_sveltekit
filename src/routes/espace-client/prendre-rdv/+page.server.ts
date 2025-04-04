import { superValidate } from 'sveltekit-superforms';
import { convertUtfToLocale } from '$lib/utils/date.js';
import { zod } from 'sveltekit-superforms/adapters';
import { rdvSchema, rdvWebdevSchema } from '$lib/types/zod';
import type { WebdevRendezVous, WebdevUser } from '$lib/types/types'
import { type Infer, message } from 'sveltekit-superforms';
import { getMotifs } from '$lib/utils/requests';
import { format, parseISO } from 'date-fns'
import { fetchToApi, encodeBase64 } from '$lib/utils/utils.js';
import { redirect } from '@sveltejs/kit';
import type { Motif } from '$lib/types/types';
import { checkAuth } from '$lib/server/jwt';
import { sendRdvEmail } from '$lib/server/email/RdvEmail.js';

import { fr } from 'date-fns/locale/fr';
import { createRdv } from '$lib/server/rdv.js';
type Message = { status: 'error' | 'success' | 'warning'; text: string };


const motifs: Motif[] = await getMotifs();

// Initialize superforms
export const load = async () => {
    const form = await superValidate<Infer<typeof rdvSchema>, Message>(zod(rdvSchema));

    return { form, motifs };
};

//POST_ACTION
export const actions = {
    default: async ({ request, cookies }) => {

        const form = await superValidate(request, zod(rdvSchema));
        const formData = form.data


        if (!form.valid) {
            // Return { form } and things will just work.
            return message(form, {
                status: 'error',
                text: 'La prise de RDV a échoué'
            });
        }

        const { authenticated, user } = await checkAuth(cookies)
        if (!authenticated || !user) {
            throw redirect(303, '/');
        }

        const webdevUser = user as WebdevUser

        const response = await createRdv(formData, motifs, webdevUser)
        if (!response.success) {
            return message(form, {
                status: 'error',
                text: 'La prise de RDV a échoué'
            });
        }
        return message(form, {
            status: 'success',
            text: 'Votre rendez-vous a bien été pris'
        })
        // redirect (303, '/espace-client/mes-rdv');


    }
};