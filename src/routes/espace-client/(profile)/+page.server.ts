import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import type { FormattedResponse, WebdevUser } from '$lib/types/types';
import type { PageServerLoad } from './$types';
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { updateUser } from '$lib/server/services/userServices';
import { error } from '@sveltejs/kit';
import { getUserById } from '$lib/server/services/userServices';
import { profileSchema, type ProfileSchemaType } from "./profileSchema";

// Initialize superforms
export const load: PageServerLoad = async ({ locals }) => {
    try {
        const userPayload = locals.user;
        if (!userPayload) {
            throw redirect(303, '/');
        }

        const userResponse = await getUserById(userPayload.userId);

        if (!userResponse.success || !userResponse.data) {
            error(400, userResponse?.error || "Error finding user");
        }
        const webdevUser: WebdevUser | null = userResponse.data;

        const formattedUser: ProfileSchemaType = {
            password: webdevUser.MotDePasse,
            passwordConfirm: webdevUser.MotDePasse,
            lastName: webdevUser.Nom,
            firstName: webdevUser.Prénom,
            isSociete: webdevUser.Société !== "",
            societe: webdevUser.Société,
            address: webdevUser.Adresse,
            city: webdevUser.Ville,
            zipcode: webdevUser.cp,
            telephone: webdevUser.Téléphone,
            email: webdevUser.Utilisateur,
        }

        //Initiate form
        const form = await superValidate(formattedUser, zod(profileSchema));
        return { form, formattedUser };
    } catch (err) {
       
        if (err instanceof Error) {
            console.error(err.message);
            error(400, err.message);
        }
        error(400, "Une erreur est survenue. Veuillez réessayer.");
    }



};

//POST_ACTIONS
export const actions = {


    //LOGOUT_ACTION
    logout: async ({ cookies }) => {
        try {
             cookies.delete('auth_token', { path: '/' });
        } catch (err) {
            console.error("logout error", err);
            if (err instanceof Error) {
                throw error(400, err.message);
            }
            throw error(400, "Une erreur est survenue lors de l'action logout. Veuillez réessayer.");
        } 
        
        return  redirect(302, '/');
        
    },

    //UPDATE_ACTION
    updateUser: async ({ request, cookies }) => {
        try {
            const form = await superValidate(request, zod(profileSchema));

            if (!form.valid) {
                console.error("form not valid", form)
                return fail(400, { form });
            }


            const response: FormattedResponse<WebdevUser> = await updateUser(cookies, form.data)
            if (!response.success) {
                error(400, response.error);
            }


            // Return the form with a status message
            return message(form, {
                status: "success",
                text: "Mise à jour effectuée !"
            });

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
                error(400, err.message);
            }
            error(400, "Une erreur est survenue lors de l'action updateUser. Veuillez réessayer.");
        }
    }
};