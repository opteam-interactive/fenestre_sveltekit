
import { getRdvsByUser } from '$lib/server/services/rdvServices';
import { redirect } from '@sveltejs/kit';
import type { WebdevRendezVous } from '$lib/types/types';
import type { PageServerLoad } from './$types';



// Get user RDV
export const load: PageServerLoad = async ({ locals }) => {
    try {

        const userPayload = locals.user;

        if (!userPayload || !userPayload.userId) {
            console.error('Error 1');
            throw redirect(303, '/');
        }
        const rdvResponse = await getRdvsByUser(userPayload.userId);

        if (!rdvResponse.success) {
            console.error('Error 2');

            return { userRdvs: [] };
        }
        if (!Array.isArray(rdvResponse.data) || rdvResponse.data.length == 0) {
            return { userRdvs: [] };
        }
        const userRdvs: WebdevRendezVous[] | null = rdvResponse.data;
        if (!userRdvs) {
            console.error('Error 3');

            return { userRdvs: [] };
        }
        return { userRdvs };

    } catch (error) {
        console.error(error);
        throw redirect(303, '/');

    }

}

//POST_ACTION
export const actions = {
};