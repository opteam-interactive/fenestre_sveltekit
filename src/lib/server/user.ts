
import { jwtVerify, decodeJwt } from "jose";
import { error } from '@sveltejs/kit';
import type { User, ResponseWithData, WebdevUser } from "$lib/types/types";
import { registerSchema } from "$routes/register/RegisterSchema";
import { JWT_SECRET } from '$env/static/private';
import type { Cookies } from "@sveltejs/kit";
import { checkAuth, updateToken } from "./jwt";
import { encodeBase64, fetchToApi } from "$lib/server/utils/utils";
import type { ProfileSchemaType } from "$routes/espace-client/profileSchema";
import type { RegisterUser } from "$routes/register/RegisterSchema";

const secretKey = new TextEncoder().encode(JWT_SECRET);


export async function getUserData(token: string): Promise<WebdevUser | null> {

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as WebdevUser; // Cast payload to your user type
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export async function getUser(cookies: Cookies): Promise<WebdevUser | null> {
    const token = cookies.get("auth_token");

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as WebdevUser; // Cast payload to your user type
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}


export async function createUser(formData: RegisterUser): Promise<ResponseWithData<WebdevUser>> {
    try {
        //Set the role as user (default)
        const defaultRole = 2

        const SQL = `INSERT INTO UTILISATEUR (Utilisateur, MotDePasse, Nom, Prénom, Société, Adresse, Ville, cp, Téléphone, Email, Droits) VALUES (
        '${formData.email || ''}',
        '${formData.password || ''}', 
        '${formData.lastName || ''}', 
        '${formData.firstName || ''}',
        '${formData.isSociete ? formData.societe : '' }', 
        '${formData.address || ''}', 
        '${formData.city || ''}', 
        '${formData.zipcode || ''}', 
        '${formData.telephone || ''}', 
        '${formData.email || ''}', 
        '${defaultRole || 2}'
        )`;

        const encodedSQL = encodeBase64(SQL);

        // Fetch data from API
        const userResponse = await fetchToApi(encodedSQL);
        const user: WebdevUser = userResponse.data

        if (!userResponse.success) {
            throw error(500, "API request failed");
        }

        //Send email
        return { success: true, data: user };

    } catch (err) {
        console.error("Error in register route:", err);
        return { success: false, errors: err?.toString() };
    }
}