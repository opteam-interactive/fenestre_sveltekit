import { superValidate } from 'sveltekit-superforms';
import { convertUtfToLocale } from '$lib/server/utils/date.js';
import { zod } from 'sveltekit-superforms/adapters';
import { rdvSchema } from './rdvSchema';
import type { WebdevRendezVous, WebdevUser } from '$lib/types/types'
import { type Infer, message } from 'sveltekit-superforms';
import { getMotifs } from '$lib/server/utils/requests';
import { format, parseISO } from 'date-fns'
import { fetchToApi, encodeBase64 } from '$lib/server/utils/utils.js';
import { redirect } from '@sveltejs/kit';
import type { Motif } from '$lib/types/types';
import { checkAuth } from '$lib/server/jwt';
import { sendRdvEmail } from '$lib/server/email/RdvEmail.js';

import { fr } from 'date-fns/locale/fr';
import { createRdv } from '$lib/server/rdv.js';

import type { PageServerLoad } from './$types';
import { getForfaitLocation } from '$lib/server/services/parametreServices';
type Message = { status: 'error' | 'success' | 'warning'; text: string };

// Initialize superforms
export const load: PageServerLoad = async () => {
    const forfaitResponse = await getForfaitLocation()
    if (!forfaitResponse.success || !forfaitResponse.data) {
        throw new Error(forfaitResponse.error);
    }
    const forfait = {
        journalier: forfaitResponse.data.journalier,
        kilometrique: forfaitResponse.data.kilometrique
    }

    const motifs: Motif[] = await getMotifs();
    const form = await superValidate<Infer<typeof rdvSchema>, Message>(zod(rdvSchema));

    return { form, motifs, forfait };
};




//POST_ACTION
export const actions = {
    default: async ({ request, cookies }) => {

        const form = await superValidate(request, zod(rdvSchema));
        const formData = form.data


        if (!form.valid) {
            console.log(form.errors)
            // Return { form } and things will just work.
            return message(form, {
                status: 'error',
                text: 'Formulaire invalide'
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
                text: 'La création de RDV a échoué'
            });
        }
        return message(form, {
            status: 'success',
            text: 'Votre rendez-vous a bien été pris'
        })
        // redirect (303, '/espace-client/mes-rdv');


    }
};