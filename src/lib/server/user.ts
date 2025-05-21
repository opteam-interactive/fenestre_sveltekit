
import { jwtVerify, decodeJwt } from "jose";
import { error } from '@sveltejs/kit';
import type { User, ResponseWithData, WebdevUser, RegisterUser } from "$lib/types/types";
import { JWT_SECRET } from '$env/static/private';
import type { Cookies } from "@sveltejs/kit";
import { checkAuth, updateToken } from "./jwt";
import { encodeBase64, fetchToApi } from "$lib/server/utils/utils";


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

export async function updateUser(cookies: Cookies, formData: User): Promise<ResponseWithData<WebdevUser>> {
    try {

        if (!formData) {
            throw error(400, "No form data provided");
        }

        // TODO : GET_CURRENT_USER
        const { authenticated, user } = await checkAuth(cookies);
        if (!user || !authenticated) {
            throw error(401, "Unauthorized");
        }

        // TODO: UPDATE_QUERY
        // MotDePasse = '${formData.password || ''}',

        const formattedData = {
            IDUtilisateur: user.IDUtilisateur as number,
            Utilisateur: formData.email ?? '',
            Nom: formData.lastName ?? '',
            Prénom: formData.firstName ?? '',
            Société: formData.societe ?? '',
            Adresse: formData.address ?? '',
            Ville: formData.city ?? '',
            cp: formData.zipcode ?? '',
            Téléphone: formData.telephone ?? '',
            Email: formData.email ?? '',
            Droits: user.Droits as number ?? 2,
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
            Société = '${formattedData.Société}',
            Adresse = '${formattedData.Adresse}',
            Ville = '${formattedData.Ville}',
            cp = '${formattedData.cp}',
            Téléphone = '${formattedData.Téléphone}',
            Email = '${formattedData.Email}',
            Droits = '${user.Droits || ''}',
            Autre1 = '${formattedData.Autre1}',
            Autre2 = '${formattedData.Autre2}',
            Autre3 = '${formattedData.Autre3}'
        WHERE UTILISATEUR.IDUtilisateur = ${user.IDUtilisateur}
    `;
        const encodedSQL = encodeBase64(SQL);

        // Send user data to webdev for update
        const userResponse = await fetchToApi(encodedSQL);

        if (!userResponse.success) {
            throw error(500, "API request failed");
        }

        //update the cookie
        const cookieUpdateResponse = await updateToken(cookies, formattedData);
        if (!cookieUpdateResponse.success) {
            throw error(500, "Failed to update token");
        }

        return { success: true, data: userResponse.data };

    } catch (err) {
        console.error("Error in register route:", err);
        return { success: false, error: err?.toString() || "Internal server error" };
    }
}


export async function createUser(formData: RegisterUser): Promise<ResponseWithData<WebdevUser>> {
    try {
        //Set the role as user (default)
        const defaultRole = 2

        const SQL = `INSERT INTO UTILISATEUR (Utilisateur, MotDePasse, Nom, Prénom, Société, Adresse, Ville, cp, Téléphone, Email, Droits, Autre1, Autre2, Autre3) VALUES ('${formData.email || ''}','${formData.password || ''}', '${formData.lastName || ''}', '${formData.firstName || ''}','${formData.societe || ''}', '${formData.address || ''}', '${formData.city || ''}', '${formData.zipcode || ''}', '${formData.telephone || ''}', '${formData.email || ''}', '${defaultRole || ''}', '${formData.other1 || ''}', '${formData.other2 || ''}', '${formData.other3 || ''}')`;

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
        return { success: false, error: err?.toString() };
    }
}