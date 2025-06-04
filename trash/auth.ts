import { JWT_SECRET } from '$env/static/private';
import { encodeBase64, fetchToApi } from "./utils";
import * as jose from 'jose'

import type { WebdevUser, User } from "$lib/types/types";
import type { Cookies } from "@sveltejs/kit";
import { invalidateAll } from '$app/navigation';


export async function login(userName: string, password: string, cookies: Cookies) {
    try {

        const SQL = `SELECT * FROM UTILISATEUR WHERE Utilisateur = '${userName}' AND MotDePasse = '${password}' LIMIT 1`;
        const encodedSQL = encodeBase64(SQL);
        // Fetch data from API
        const userResponse = await fetchToApi(encodedSQL);
        if (!userResponse.success || userResponse.data.erreur) {
            return { success: false, error: "Erreur de connexion, veuillez vérifier votre email et mot de passe et réessayer" };
        }

        if (userResponse.data[0].Droits < 2) {
            return { success: false, error: "User is not authorized" };
        }

        if (userResponse.data[0] && userResponse.data[0].MotDePasse != password) {
            return { success: false, error: "Invalid password" };
        }


        if (!userResponse.success) {
            return { success: false, error: "API request failed" };
        }

        //Get first user (should only be one)
        const user: WebdevUser | undefined = userResponse.data[0];

        if (!user) {
            return { success: false, error: "Invalid username or password" };
        }


        // Generate JWT secretKey (necessary for signing JWT token)
        const secretKey = new TextEncoder().encode(JWT_SECRET);

        const tokenPayload = {
            userId: user.IDUtilisateur,
            email: user.Email,
            role: user.Droits
        };

        // 🔹 Generate JWT Token
        const token = await new jose.SignJWT(tokenPayload)
            .setProtectedHeader({ alg: "HS256" }) // Algorithm
            .setExpirationTime("1h") // Expiry
            .sign(secretKey); // Sign with key

        // 🔹 Set JWT token in cookie

        cookies.set("auth_token", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600 * 24, // 1 hour
        });

        return { success: true, user: tokenPayload }; // Send user data back (excluding password)

    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}
