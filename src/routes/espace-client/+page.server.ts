import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/utils/zod';
import { type Infer, message } from 'sveltekit-superforms';
import { getUser } from '$lib/utils/auth.js';
import type { User } from '$lib/utils/types.js';


type Message = { status: 'error' | 'success' | 'warning'; text: string };

// Initialize superforms
export async function load({ cookies, parent}) {
    
    const webDevUser = await getUser(cookies)

    const user: User = {
        id: webDevUser ? webDevUser?.IDUtilisateur : 0,
        password : "",
        passwordConfirm : "" ,
        category :webDevUser?.Société === "" ? "particulier" : "societe",
        email: webDevUser ? webDevUser?.Email : "" ,
        societe: webDevUser ? webDevUser?.Société :"",
        lastName: webDevUser ? webDevUser?.Nom :"",
        firstName: webDevUser ? webDevUser?.Prénom :"",
        telephone:webDevUser ?  webDevUser?.Téléphone :"",
        address: webDevUser ? webDevUser?.Adresse:"", 
        zipcode: webDevUser ? webDevUser?.cp : "",
        city: webDevUser ? webDevUser?.Ville : "",
    }

    //Initiate form
    const form = await superValidate<Infer<typeof userSchema>, Message>(user, zod(userSchema));
    return { form, user };
};

//POST_ACTION
export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(userSchema));

        if (!form.valid) {
            // Return { form } and things will just work.
            return message(form, {
                status: 'error',
                text: 'La création de compte a echoué'
            });

        }

        // TODO: Do something with the validated form.data

        // Return the form with a status message
        return message(form, {
            status: 'success',
            text: 'Création de compte reussie !'
        });
    }
};