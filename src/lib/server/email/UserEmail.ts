import { sendEmail } from "$lib/server/email/sendEmail";
import type { ResponseNoData, ResponseWithData, FormattedResponse } from "$lib/types/types";
import type { RegisterSchemaType } from "$routes/register/RegisterSchema";
import { error } from "@sveltejs/kit";
import type { SentMessageInfo } from "nodemailer";

export async function sendRegisterEmail(user: RegisterSchemaType):Promise<FormattedResponse<SentMessageInfo>> {
    if (!user) {
        throw error(500, "No user provided");
    }
    try {
        const email = user.email
        const name = `${user.lastName} ${user.firstName}`
        const html = `
        <h2>Bonjour,</h2>
    <h3>Vous venez de créer un compte client sur le site du garage Fenestre.</h3>
    <h4>Vous pouvez à présent vous connecter sur le site et prendre rendez-vous.</h4>
    
    <p>Voici un résumé de votre profil utilisateur :</p>
    
    <ul>
        <li>Email/identifiant : ${user.email} </li>
        <li>Nom : ${user.lastName}</li>
        <li>Prénom : ${user.firstName}</li>
        <li>Téléphone : ${user.telephone}</li>
        <li>Société : ${user.societe ?? "Non renseigné"}</li>
        <li>Adresse : ${user.address } - ${user.zipcode} ${user.city}</li>
    </ul>
    <p>Vous pouvez nous contacter au 02 35 46 03 70</p>
    <p>Cordialement</p>
    <p>Garage Benoist Fenestre</p>
        `
        const response = await sendEmail(email, name, html, "Confirmation de création de votre compte");
        if (!response.success) {
            throw error(500, "API request failed");
        }
        return { success: true, data: response }
    } catch (err) {
        console.error(err)
        return { success: false, error: err?.toString() }
    }

}
