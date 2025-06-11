import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { rdvSchema } from './rdvSchema';
import { type Infer, message } from 'sveltekit-superforms';
import { getMotifs, getMotifsList, getMotifsWithQuestions } from '$lib/server/services/motifServices';
import type { Motif, MotifName, MotifWithDetails, MotifWithQuestions } from '$lib/types/types';
import { createRdv } from '$lib/server/services/rdvServices';
import { error, fail } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { getForfaitLocation } from '$lib/server/services/parametreServices';
import { getMotifByID } from '$lib/server/services/motifServices';
import { getUserById } from '$lib/server/services/userServices';
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

    const motifsResponse = await getMotifsWithQuestions();

    if (!motifsResponse || !motifsResponse.success || !motifsResponse.data) {
        throw new Error(motifsResponse.error);
    }

    const motifs: MotifWithDetails[] = motifsResponse.data;

    const form = await superValidate<Infer<typeof rdvSchema>, Message>(zod(rdvSchema));

    return { form, motifs, forfait };
};




//POST_ACTION
export const actions = {

    default: async ({ request, locals }) => {
        const form = await superValidate(request, zod(rdvSchema));

        try {
            if (!form.valid) {
                if (!form.valid) {
                    return fail(400, { form });
                }
            }


            //Get motif from id 
            const motifResponse = await getMotifByID(form.data.motifId);

            if (!motifResponse || !motifResponse.success || !motifResponse.data) {
                return message(form, "Le motif n'existe pas", {
                    status: 404
                });
            }

            //Get user from id
            const userId = locals.user?.userId;
            if (!userId) {
                return message(form, 'ID Utilisateur non trouvé', {
                    status: 404
                });
            }
            const userResponse = await getUserById(userId);

            if (!userResponse || !userResponse.success || !userResponse.data) {
                return message(form, 'Erreur lors de la recherche de l\'utilisateur', {
                    status: 400
                });
            }


            const response = await createRdv(form.data, motifResponse.data, userResponse.data);


            if (!response.success) {
                return message(form, 'La création de RDV a échoué', {
                    status: 500
                });
            }
            return message(form, 'Votre rendez-vous a bien été pris')
            // redirect (303, '/espace-client/mes-rdv');
        } catch (err) {
            console.error(err);
            throw error(400, "Une erreur est survenue lors de l'action de prise de rendez-vous. Veuillez réessayer.");
        }
    }
};