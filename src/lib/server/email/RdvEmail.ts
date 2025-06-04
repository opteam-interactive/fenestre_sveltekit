import { sendEmail } from "$lib/server/email/sendEmail";
import type { RendezVous, WebdevUser, Motif, FormattedResponse } from "$lib/types/types";
import type { rdvSchemaType } from "$routes/espace-client/prendre-rdv/rdvSchema";

export async function sendRdvEmail(user: WebdevUser, rdv: rdvSchemaType, motif: Motif): Promise<FormattedResponse<any>> {
    try {
        const email = user.Email
        const name = `${user.Nom} ${user.Prénom}`

        const html = `
        <h2>Bonjour,</h2>
    <h3>Vous venez de prendre rendez-vous avec le garage Fenestre.</h3>
    ${rdv.appointmentDate ?
                `<h4>Date du RDV : ${new Date(rdv.appointmentDate).toLocaleDateString("fr-FR")} - ${rdv.appointmentTime}</h4>` : ""} 
    
    
    <p>Note : Si vous avez plusieurs travaux à effectuer, merci de nous contacter au 02 35 46 03 70.</p>
    <p>Pensez à prendre votre permis de conduire et votre carte grise</p>
    <p>Voici un résumé de votre rendez-vous :</p>
    
    <ul>
        <li>Véhicule : ${rdv.brand} - ${rdv.model}</li>
        <li>Immatriculation : ${rdv.plateNumber}</li>
        <li>Intervention :  ${rdv.rdvCategory === 'AtelierP' ? 'Mécanique' : 'Carrosserie'}</li>
                <li> Travaux : ${motif.Motif || "Non défini"}
                <li> Details : ${JSON.stringify(JSON?.parse(rdv.motifDetails), null, '\t') || "Non renseigné"}  </li>
                </li>
                <li>Devis : ${rdv.chiffrage ? "Oui" : "Non"}</li>
                <li> Prêt : ${rdv.rental ? "Oui" : "Non"}</li>
                ${rdv.rental ? `<li>Type de location : ${rdv.rentalCategory === "eco" ? "Eco" : "Standard"}</li>` : ""}
                ${rdv.rental ? `<li> Transmission : ${rdv.rentalDrive === "manual" ? "Manuelle" : "Automatique"}</li>` : ""}
                <li> Type de dépot :  ${rdv.contactless ? "Sans contact" : "Sur horaires d'ouverture"} </li>
    </ul>
    <p>Vous pouvez nous contacter au 02 35 46 03 70</p>
    <p>Cordialement</p>
    <p>Garage Benoist Fenestre</p>
        `

        const response  = await sendEmail(email, name, html, "Confirmation de votre rendez-vous");
        return { success: true, data: response  }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Unexpected error" }
    }

}
