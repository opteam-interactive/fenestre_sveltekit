import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { rdvSchema } from './rdvSchema';
import { type Infer, message } from 'sveltekit-superforms';
import { getMotifs } from '$lib/server/services/motifServices';
import type { Motif } from '$lib/types/types';
import { createRdv } from '$lib/server/services/rdvServices';

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

    const motifsResponse = await getMotifs();

    if (!motifsResponse || !motifsResponse.success || !motifsResponse.data) {
        throw new Error(motifsResponse.error);
    }

    const motifList: Motif[] = motifsResponse.data;



    const motifs = motifList.filter((motif) =>
        !motif.NomActivité.includes("AucunP")
    )

    const form = await superValidate<Infer<typeof rdvSchema>, Message>(zod(rdvSchema));

    return { form, motifs, forfait };
};




//POST_ACTION
export const actions = {

    default: async ({ request, cookies, locals }) => {
        const form = await superValidate(request, zod(rdvSchema));

        if (!form.valid) {
            console.error(form.errors)
            // Return { form } and things will just work.
            return message(form, {
                status: 'error',
                text: 'Formulaire invalide'
            });
        }


        //Get motif from id 
        const motifResponse = await getMotifByID(form.data.motifId);

        if (!motifResponse || !motifResponse.success || !motifResponse.data) {
            return message(form, {
                status: 'error',
                text: 'Le motif n\'existe pas'
            });
        }

        //Get user from id
        const userId = locals.user?.userId;
        if (!userId) {
            return message(form, {
                status: 'error',
                text: 'ID Utilisateur non trouvé'
            });
        }
        const userResponse = await getUserById(userId);

        if (!userResponse || !userResponse.success || !userResponse.data) {
            return message(form, {
                status: 'error',
                text: 'Erreur lors de la recherche de l\'utilisateur'
            });
        }

        
        const response = await createRdv(form.data, motifResponse.data, userResponse.data);

        
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