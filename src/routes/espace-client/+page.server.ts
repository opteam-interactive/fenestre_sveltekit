import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/types/zod';
import { redirect } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/jwt.js';
import { webDevUserToUser } from '$lib/utils/convertTypes';
import type { WebdevUser, User } from '$lib/types/types';


// Initialize superforms
export async function load({ cookies, parent, request }) {
    const { user } = await checkAuth(cookies) ;

    const webdevUser: User = webDevUserToUser(user) ;

    //Initiate form
    const form = await superValidate(webdevUser, zod(userSchema));
    return { form: webdevUser ? webdevUser : form };
};

//POST_ACTION
export const actions = {

    logout: async ({ cookies }) => {
        cookies.delete('auth_token', { path: '/' });
        throw redirect(303, '/');
    }
};