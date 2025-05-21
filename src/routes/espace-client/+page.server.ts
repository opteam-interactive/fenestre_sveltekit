import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/types/zod';
import { redirect } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/jwt.js';
import { webDevUserToUser } from '$lib/server/utils/convertTypes';
import type { WebdevUser, User, ResponseWithData } from '$lib/types/types';
import type { PageServerLoad } from './$types';

import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { updateUser } from '$lib/server/user'
import { error } from '@sveltejs/kit';
import { getUserById } from '$lib/server/services/userServices';

// Initialize superforms
export const load: PageServerLoad = async ({ locals }) => {
    const userPayload = locals.user;
    if (!userPayload) {
        throw redirect(303, '/');
    }

    const userResponse = await getUserById(userPayload.userId);

    if (!userResponse.success || !userResponse.data) {
        throw error(400, userResponse?.error || "User not found");
    }
    const webdevUser: WebdevUser | null = userResponse.data;
    const user: User = webDevUserToUser(webdevUser);


    //Initiate form
    const form = await superValidate(user, zod(userSchema));
    return { form, user };
};

//POST_ACTIONS
export const actions = {

    //LOGOUT_ACTION
    logout: async ({ cookies }) => {
        cookies.delete('auth_token', { path: '/' });
        throw redirect(303, '/');
    },

    //UPDATE_ACTION
    updateUser: async ({ request, cookies }) => {

        const form = await superValidate(request, zod(userSchema));

        if (!form.valid) {
            console.log("form not valid", form)
            return fail(400, { form });
        }

        try {
            const response: ResponseWithData<WebdevUser> = await updateUser(cookies, form.data)
            console.log("response", response)
            if (!response.success) {
                throw error(400, response.errors);
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
        return message(form, {
            status: "success",
            text: "Mise à jour effectuée !"
        });

    }
};