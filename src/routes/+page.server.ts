import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/utils/zod';
import {  redirect } from '@sveltejs/kit';
import { encodeBase64, fetchToApi } from '$lib/utils/utils.js';
import * as jose from 'jose'
import { JWT_SECRET } from '$env/static/private';

import type { WebdevUser } from '$lib/utils/types.js';
import { type Infer, message } from 'sveltekit-superforms';



type Message = { status: 'error' | 'success' | 'warning'; text: string };


// Initialize superforms
export const load = async () => {
    const form = await superValidate<Infer<typeof loginSchema>, Message>(zod(loginSchema));
    return { form };
};

//POST_ACTION
export const actions = {
    default: async ({ request, cookies }) => {
        const form = await superValidate(request, zod(loginSchema));

        if (!form.valid) {
            // Return { form } and things will just work.
            return message(form, {
                status: 'error',
                text: 'Connexion echouee !'
            });
        }

        try {
            loginSchema.parse(form.data)
            const SQL = `SELECT * FROM UTILISATEUR WHERE Utilisateur = '${form.data.userName}' AND MotDePasse = '${form.data.password}' LIMIT 1`;
            const encodedSQL = encodeBase64(SQL);
            // Fetch data from API
            const userResponse = await fetchToApi(encodedSQL);

            if (!userResponse.success) {
                return message(form, {
                    status: 'error',
                    text: 'Utilisateur non trouvé'
                });
            }
            //Get first user (should only be one)
            const user: WebdevUser = userResponse.data[0]

            if(!user){
                return message(form, {
                    status: 'error',
                    text: "Ces identifiants sont incorrects"
                });
            }
            const { MotDePasse, ...userData } = user;

            console.log("user", user)

            // Generate JWT token
            const secretKey = new TextEncoder().encode(JWT_SECRET);

            // 🔹 Generate JWT Token
            const token = await new jose.SignJWT(userData)
                .setProtectedHeader({ alg: "HS256" }) // Algorithm
                .setExpirationTime("1h") // Expiry
                .sign(secretKey); // Sign with key


            cookies.set("auth_token", token, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600 * 24, // 1 hour
            });

        } catch (error) {
            return message(form, {
                status: 'error',
                text: 'Error : ' + error
            });
        }

        // If all successful, redirect
        redirect(303, "/espace-client");

    }
};