import { encodeBase64, fetchToApi } from "$lib/server/utils/webdev"
import type { FormattedResponse, WebdevUser } from "$lib/types/types"
import type { Cookies } from "@sveltejs/kit";
import type { ProfileSchemaType } from "$routes/espace-client/(profile)/profileSchema";
import { checkAuth } from "$lib/server/utils/jwt";
import type { RegisterSchemaType } from "$routes/register/RegisterSchema";
import { sendRegisterEmail } from "../email/UserEmail";

export const getUserById = async (id: number): Promise<FormattedResponse<WebdevUser>> => {
    try {
        const SQL = `SELECT * FROM Utilisateur WHERE IDUtilisateur = ${id}`
        const encodedSQL = encodeBase64(SQL)

        const response = await fetchToApi(encodedSQL)

        if (!response.success) {
            throw new Error(response.error)
        }

        if (!response.data[0]) {
            throw new Error("User not found")
        }

        return {
            success: true,
            data: response.data[0]
        }
    } catch (err) {
        console.error("getUserById error:", err);
        throw err
    }

}

export async function checkExistingUser(email: string): Promise<boolean> {
    try {
        const SQL = `SELECT * FROM UTILISATEUR WHERE Email = '${email}'`
        const encodedSQL = encodeBase64(SQL)
        const response = await fetchToApi(encodedSQL)
        if (!response.success) {
            throw new Error(response.error)
        }
        return response.data.length > 0
    } catch (err) {
        console.error("checkExistingUser error:", err);
        throw err
    }
}


export async function createUser(formData: RegisterSchemaType): Promise<FormattedResponse<WebdevUser>> {
    try {
        //Set the role as user (default)
        const defaultRole = 2

        const SQL = `INSERT INTO UTILISATEUR (Utilisateur, MotDePasse, Nom, Prénom, Société, Adresse, Ville, cp, Téléphone, Email, Droits) VALUES (
        '${formData.email || ''}',
        '${formData.password || ''}', 
        '${formData.lastName || ''}', 
        '${formData.firstName || ''}',
        '${formData.isSociete ? formData.societe : ''}', 
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
            throw new Error(userResponse.error);
        }

        //Send email
        // //TODO//SEND_CONFIRMATION_EMAIL
        const response = await sendRegisterEmail(formData);
        if (!response.success) {
            throw new Error(response.error);
        }
        return { success: true, data: user };

    } catch (err) {
        console.error("CreateUser error:", err);
       throw err
    }
}

export async function updateUser(cookies: Cookies, formData: ProfileSchemaType): Promise<FormattedResponse<WebdevUser>> {
    try {

        if (!formData) {
            throw new Error("No form data provided");
        }

        //  GET_CURRENT_USER
        const { authenticated, user } = await checkAuth(cookies);
        if (!user || !authenticated) {
            throw new Error("User not authenticated");
        }



        const formattedData = {
            IDUtilisateur: user.userId as number,
            Utilisateur: formData.email ?? '',
            Nom: formData.lastName ?? '',
            Prénom: formData.firstName ?? '',
            Société: formData.isSociete ? formData.societe : '',
            Adresse: formData.address ?? '',
            Ville: formData.city ?? '',
            cp: formData.zipcode ?? '',
            Téléphone: formData.telephone ?? '',
            Email: formData.email ?? '',
            Droits: user.role as number ?? 2,
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
            Droits = '${formattedData.Droits || ''}'
        WHERE UTILISATEUR.IDUtilisateur = ${formattedData.IDUtilisateur};
    `;
        const encodedSQL = encodeBase64(SQL);


        // Send user data to webdev for update
        const userResponse = await fetchToApi(encodedSQL);

        if (!userResponse.success || userResponse.data.erreur) {
            throw new Error(userResponse.error);
        }

        // //update the cookie
        // const cookieUpdateResponse = await updateToken(cookies, formattedData);
        // if (!cookieUpdateResponse.success) {
        //     throw error(500, "Failed to update token");
        // }

        return { success: true, data: userResponse.data };

    } catch (err) {
        console.error("UpdateUser error:", err);
       throw err
    }
}
