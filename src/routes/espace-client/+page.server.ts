import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/types/zod';
import { redirect } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/jwt.js';
import { webDevUserToUser } from '$lib/utils/convertTypes';
import type { WebdevUser, User, ServerResponse } from '$lib/types/types';
import { register } from '$lib/server/auth';
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { updateUser } from '$lib/server/user'
import { error } from '@sveltejs/kit';

// Initialize superforms
export async function load({ cookies, parent, request }) {
    const { user } = await checkAuth(cookies);

    const webdevUser: User = webDevUserToUser(user);

    //Initiate form
    const form = await superValidate(webdevUser, zod(userSchema));
    return { form: webdevUser ? webdevUser : form };
};

//POST_ACTION
export const actions = {

    logout: async ({ cookies }) => {
        cookies.delete('auth_token', { path: '/' });
        throw redirect(303, '/');
    },

    updateUser: async ({ request, cookies }) => {
       
        const form = await superValidate(request, zod(userSchema));

        if (!form.valid) {
            console.log("form not valid", form)
            return fail(400, { form  });
        }


        try {
            const response: ServerResponse<WebdevUser> = await updateUser(cookies, form.data)
            console.log("response", response)

            if (!response.success) {
                throw error(400, response.error);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            return message(form, {
                status: "error",
                text: "Une erreur est survenue. Veuillez réessayer."
            });
        }
        console.log("success !")
        // Return the form with a status message
        redirect(303, "/espace-client");

    }
};