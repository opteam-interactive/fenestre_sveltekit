import { JWT_SECRET } from '$env/static/private';
import { encodeBase64, fetchToApi } from "../utils/utils";
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

        if (!userResponse.success) {
            return { success: false, error: "API request failed" };
        }

        //Get first user (should only be one)
        const user: WebdevUser | undefined = userResponse.data[0];

        if (!user) {
            return { success: false, error: "Invalid username or password" };
        }

        // Get user without password
        const { MotDePasse, ...userData } = user;

        // Generate JWT secretKey (necessary for signing JWT token)
        const secretKey = new TextEncoder().encode(JWT_SECRET);

        // 🔹 Generate JWT Token
        const token = await new jose.SignJWT(userData)
            .setProtectedHeader({ alg: "HS256" }) // Algorithm
            .setExpirationTime("1h") // Expiry
            .sign(secretKey); // Sign with key

        // 🔹 Set JWT token in cookie
        invalidateAll();
        cookies.set("auth_token", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600 * 24, // 1 hour
        });

        return { success: true, user: userData }; // Send user data back (excluding password)

    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function register(formData: User) {
    try {
        //Set the role as user (default)
        const defaultRole = 2

        const SQL = `INSERT INTO UTILISATEUR (Utilisateur, MotDePasse, Nom, Prénom, Société, Adresse, Ville, cp, Téléphone, Email, Droits, Autre1, Autre2, Autre3) VALUES ('${formData.email || ''}','${formData.password || ''}', '${formData.lastName || ''}', '${formData.firstName || ''}','${formData.company || ''}', '${formData.address || ''}', '${formData.city || ''}', '${formData.zipcode || ''}', '${formData.phone || ''}', '${formData.email || ''}', '${defaultRole || ''}', '${formData.other1 || ''}', '${formData.other2 || ''}', '${formData.other3 || ''}')`;

        const encodedSQL = encodeBase64(SQL);

        // Fetch data from API
        const userResponse = await fetchToApi(encodedSQL);

        if (!userResponse.success) {
            return { success: false, error: "API request failed" };
        }

        return { success: true, user: userResponse.data };

    } catch (error) {
        console.error("Error in register route:", error);
        return { success: false, error: "Registration failed" };
    }
}