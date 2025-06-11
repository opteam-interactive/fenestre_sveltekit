import type { FormattedResponse, Motif, WebdevRendezVous, WebdevUser } from "$lib/types/types";
import type { rdvSchemaType } from "$routes/espace-client/prendre-rdv/rdvSchema"
import { encodeBase64, fetchToApi } from "$lib/server/utils/webdev";
import { convertUtfToLocale } from "../utils/date";
import { format, nextFriday } from 'date-fns'
import { sendRdvEmail } from "../email/RdvEmail";

export const getRdvsByUser = async (id: number): Promise<FormattedResponse<WebdevRendezVous[]>> => {
    try {
        if (id == null) {
            return {
                success: false,
                error: "Missing id"
            }
        }
        const SQL = `SELECT * FROM RendezVous WHERE IDUtilisateur = ${id}`
        const encodedSQL = encodeBase64(SQL)

        const response = await fetchToApi(encodedSQL)

        if (!response.success || !Array.isArray(response.data)) {
            throw new Error(response.error)
        }

        if (Array.isArray(response.data) && response.data.length == 0) {
            return {
                success: true,
                data: []
            }
        }

        const rdvs: WebdevRendezVous[] = response.data

        return {
            success: true,
            data: rdvs
        }
    } catch (err) {
        console.error(err);
       throw err
    }
}



export const getRdvsByDate = async (date: string): Promise<FormattedResponse<WebdevRendezVous[]>> => {
    try {
        const lowerBound = `${date}T00:00:00.000`
        const upperBound = `${date}T23:59:59.999`
        //Fetch RDVs only for the selected date with motif
        const SQL = `SELECT * FROM RendezVous WHERE DateRécept BETWEEN '${lowerBound}' AND '${upperBound}' `

        // const SQL = `SELECT * FROM RendezVous LEFT JOIN MotifRDV ON RendezVous.IDMotifRDV = MotifRDV.IDMotifRDV WHERE DateRécept BETWEEN '${lowerBound}' AND '${upperBound}' `
        const encodedSQL = encodeBase64(SQL)
        const response = await fetchToApi(encodedSQL)

        if (!response.success) {
            throw new Error(response.error)
        }

        if (response.data.erreur) {
            return {
                success: true,
                message: response.data.erreur,
                data: []
            }
        }
        //if no appointment, send all time slots
        if (Array.isArray(response.data) && response.data.length == 0) {
            return {
                success: true,
                data: []
            }
        }

        const rdvs: WebdevRendezVous[] = response.data
        return {
            success: true,
            data: rdvs
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred in the getRdvsByDate function");
    }
}


export const createRdv = async (formData: rdvSchemaType, motif: Motif, user: WebdevUser): Promise<FormattedResponse<WebdevRendezVous>> => {
    try {
        if (!formData) {
            throw new Error("Missing form data");
        }
        let formattedDateRecept = ""
        let formattedDateRestit = ""
        if (formData.appointmentDate && formData.appointmentTime) {
            // Get DateRecept in UTC time
            formattedDateRecept = convertUtfToLocale(formData.appointmentDate, formData.appointmentTime)

            // Set DateRestit to next friday 18:00:00.000
            formattedDateRestit = convertUtfToLocale(nextFriday(formData.appointmentDate), "18:00")


        }


        const jsonMotifDetails = JSON.parse(formData.motifDetails);
        const formattedMotifDetails = Object.entries(jsonMotifDetails)
            .map(([key, value]) => `${key} - ${value}`)
            .join('\n'); // or use ', ' if you prefer

        // Format Travaux description
        const formattedTravaux = `${motif?.Motif} 
        - PRET VEHICULE = ${formData.rental ? "OUI" : "NON"} 
        - CHIFFRAGE = ${formData.chiffrage ? "OUI" : "NON"} 
        - TYPE DE VEHICULE SOUHAITE = ${formData.rentalCategory ?? "SANS OBJET"} 
        - TYPE DE BOITE DE VITESSE SOUHAITEE = ${formData.rentalDrive ?? "SANS OBJET"} 
        - SANS CONTACT = ${formData.contactless === "true" ? "OUI" : "NON"}
        - ${formattedMotifDetails ?? ""}`;



        // Build RDV Object
        const rdv: WebdevRendezVous = {
            NomSite: "PEUGEOT",
            DateRécept: formattedDateRecept,
            DateRestit: formattedDateRestit,
            Client: `${user.Société ?? ""} ${user.Nom ?? ""} ${user.Prénom ?? ""}`.trim(),
            Téléphone: user.Téléphone ?? "",
            Mobile: user.Téléphone ?? "",
            ClientEmail: user.Email,
            ClientAdresse: user.Adresse ?? "",
            ClientCP: user.cp ?? "",
            ClientVille: user.Ville ?? "",
            Marque: formData.brand,
            Modèle: formData.model,
            Version: "",
            immatriculation: formData.plateNumber,
            Travaux: formattedTravaux,
            NomActivité: motif.NomActivité || "AucunP",
            NbHeureTx: parseFloat(parseFloat(motif?.TempsEstimé!).toFixed(2)),
            Observations: "",
            IDVoiturePret: 0,
            ClientAssurance: " ",
            Cdé: false,
            // DépotSansContact: formData.contactless === "true" ? true : false,
            DépotSansContact: false,
            CréateurDateh: format(new Date(), "yyyyMMddHHmmssSSS"),
            ModifieurDateh: "",
            ModifieurID: 0,
            IDMotifRDV: motif?.IDMotifRDV ?? formData.motifId,
            IDUtilisateur: user.IDUtilisateur ?? null,
            IDVéhicule: 0,
            SaisieDuClient: "",
            Etat: 1,
            Blacklistage: ""

        };



        const SQL = `
INSERT INTO RendezVous (
NomSite, DateRécept, DateRestit, Client, Téléphone, Mobile, ClientEmail, 
ClientAdresse, ClientCP, ClientVille, Marque, Modèle, Version, immatriculation, 
Travaux, NomActivité, NbHeureTx, Observations, IDVoiturePret, ClientAssurance, 
Cdé, DépotSansContact, CréateurDateh, ModifieurDateh, ModifieurID, IDMotifRDV, 
IDUtilisateur, IDVéhicule, SaisieDuClient, Etat, Blacklistage
) VALUES (
'${rdv.NomSite}', 
'${rdv.DateRécept}', 
'${rdv.DateRestit}', 
'${rdv.Client}', 
'${rdv.Téléphone}', 
'${rdv.Mobile}', 
'${rdv.ClientEmail}', 
'${rdv.ClientAdresse}', 
'${rdv.ClientCP}', 
'${rdv.ClientVille}', 
'${rdv.Marque}', 
'${rdv.Modèle}', 
'${rdv.Version}',
'${rdv.immatriculation}', 
'${rdv.Travaux}', 
'${rdv.NomActivité}', 
${rdv.NbHeureTx}, 
'${rdv.Observations}', 
'${rdv.IDVoiturePret}', 
'${rdv.ClientAssurance}', 
${rdv.Cdé === null ? "NULL" : `'${rdv.Cdé}'`}, 
${rdv.DépotSansContact ? 1 : 0}, 
'${rdv.CréateurDateh}', 
${rdv.ModifieurDateh === null ? "NULL" : `'${rdv.ModifieurDateh}'`}, 
${rdv.ModifieurID === null ? "NULL" : `'${rdv.ModifieurID}'`}, 
'${rdv.IDMotifRDV}', 
${rdv.IDUtilisateur === null ? "NULL" : `'${rdv.IDUtilisateur}'`}, 
${rdv.IDVéhicule === null ? "NULL" : `'${rdv.IDVéhicule}'`}, 
${rdv.SaisieDuClient === null ? "NULL" : `'${rdv.SaisieDuClient}'`}, 
${rdv.Etat === null ? "NULL" : `'${rdv.Etat}'`}, 
${rdv.Blacklistage === "" ? "NULL" : `'${rdv.Blacklistage}'`}
);
`;

        const encodedSQL = encodeBase64(SQL);

        const apiResponse = await fetchToApi(encodedSQL);
        if (!apiResponse.success) {
            // Gestion des erreurs de l'API externe
            throw new Error(apiResponse.error);

        }

        //SEND_CONFIRMATION_EMAIL
        const response = await sendRdvEmail(user, formData, motif!);

        if (!response.success) {
            throw new Error(response.error);
        }

        return {
            success: true,
            error: "",
            data: apiResponse.data
        }
    }
    catch (err) {
        console.error(err);
        throw err

    }
}


