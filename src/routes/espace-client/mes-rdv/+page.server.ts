import { checkAuth } from '$lib/server/jwt.js';
import { getUserRdvs } from '$lib/server/rdv.js';
import type { WebdevUser } from '$lib/types/types.js';
import { redirect } from '@sveltejs/kit';
import { cp } from 'fs';


// Get user RDV
export async function load({ cookies }) {
    try {
        const data = await checkAuth(cookies);

        if (!data.authenticated) {
            throw redirect(303, '/');
        }
        if (!data.user) {
            throw redirect(303, '/');
        }
        
        const userRdvs = await getUserRdvs((data.user as WebdevUser).IDUtilisateur);
        
        if (!userRdvs) {
            throw redirect(303, '/');
        }
        return { userRdvs };

    } catch (error) {

    }




}

//POST_ACTION
export const actions = {
};