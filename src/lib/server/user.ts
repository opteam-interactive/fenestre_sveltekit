
import { jwtVerify, decodeJwt } from "jose";
import {error} from '@sveltejs/kit';
import type { User, ServerResponse, WebdevUser } from "$lib/types/types";
import { JWT_SECRET } from '$env/static/private';
import type { Cookies } from "@sveltejs/kit";
import { checkAuth } from "./jwt";
import { encodeBase64, fetchToApi } from "$lib/utils/utils";

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

export async function updateUser(cookies: Cookies, formData: User): Promise<ServerResponse<WebdevUser>> {
    try {
     
        if (!formData) {
            throw error(400,"No form data provided");
        }
    

        // TODO : GET_CURRENT_USER
        const { authenticated, user } = await checkAuth(cookies);
        if (!user || !authenticated) {
            throw error(401, "Unauthorized");
        }
       
        // TODO: UPDATE_QUERY
        // MotDePasse = '${formData.password || ''}',

        const formattedData = {
            Utilisateur: formData.email ?? '',
            Nom: formData.lastName ?? '',
            Prénom: formData.firstName ?? '',
            Société: formData.societe ?? '',
            Adresse: formData.address ?? '',
            Ville: formData.city ?? '',
            cp: formData.zipcode ?? '',
            Téléphone: formData.telephone ?? '',
            Email: formData.email ?? '',
            Droits: user.Droits ?? '',
            Autre1: formData.other1 ?? '',
            Autre2: formData.other2 ?? '',
            Autre3: formData.other3 ?? ''
        }
        
        const SQL = `
        UPDATE UTILISATEUR
        SET
            Utilisateur = '${formattedData.Utilisateur}',
            Nom = '${formattedData.Nom}',
            Prénom = '${formattedData.Prénom}',
            Société = '${formattedData.Société }',
            Adresse = '${formattedData.Adresse}',
            Ville = '${formattedData.Ville}',
            cp = '${formattedData.cp }',
            Téléphone = '${formattedData.Téléphone}',
            Email = '${formattedData.Email}',
            Droits = '${user.Droits || ''}',
            Autre1 = '${formattedData.Autre1}',
            Autre2 = '${formattedData.Autre2}',
            Autre3 = '${formattedData.Autre3}'
        WHERE UTILISATEUR.IDUtilisateur = ${user.IDUtilisateur}
    `;
 
        const encodedSQL = encodeBase64(SQL);

        // Fetch data from API
        const userResponse = await fetchToApi(encodedSQL);

        if (!userResponse.success) {
            throw error(500, "API request failed");
        }
     
        return { success: true, data: userResponse.data };

    } catch (err) {
        console.error("Error in register route:", err);
        return { success: false, error: err.message || "Internal server error" };
    }
}