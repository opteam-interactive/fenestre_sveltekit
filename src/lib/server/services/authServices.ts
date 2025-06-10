import { JWT_SECRET } from '$env/static/private';
import { encodeBase64, fetchToApi } from "$lib/server/utils/webdev";
import * as jose from 'jose'
import type { WebdevUser } from "$lib/types/types";
import type { Cookies } from "@sveltejs/kit";


export async function login(userName: string, password: string, cookies: Cookies) {
    try {

        const SQL = `SELECT * FROM UTILISATEUR WHERE Utilisateur = '${userName}' AND MotDePasse = '${password}' LIMIT 1`;
        const encodedSQL = encodeBase64(SQL);
        // Fetch data from API
        const userResponse = await fetchToApi(encodedSQL);


        if (!userResponse.success || userResponse.data.erreur) {
            throw new Error("Erreur de connexion, veuillez vérifier votre email et mot de passe et réessayer");
        }

        if (userResponse.data[0].Droits < 2) {
            throw new Error("User is not authorized");
        }

        if (userResponse.data[0] && userResponse.data[0].MotDePasse != password) {
            throw new Error("Invalid password");
        }


        if (!userResponse.success) {
            throw new Error("API request failed");
        }

        //Get first user (should only be one)
        const user: WebdevUser | undefined = userResponse.data[0];

        if (!user) {
            throw new Error("Invalid username or password");
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
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred in the login function");
    }
}