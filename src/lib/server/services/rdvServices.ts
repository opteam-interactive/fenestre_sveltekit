import type { FormattedResponse, Motif, RendezVous, WebdevRendezVous, WebdevUser } from "$lib/types/types";
import { encodeBase64, fetchToApi } from "$lib/server/utils/utils";

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
            return {
                success: false,
                error: response.error
            }
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
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: "Unexpected error"
        }
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
        if (!response.success || !Array.isArray(response.data)) {
            return {
                success: false,
                error: "empty array",
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
        console.error(error)
        return {
            success: false,
            error: "Unexpected error"
        }
    }
}


export  const createRdv = async(formData: RendezVous, motif: Motif, user: WebdevUser): Promise<FormattedResponse<WebdevRendezVous>> => {
    try {
        // Get DateRecept in UTC time
        const formattedDateRecept = convertUtfToLocale(formData.appointmentDate, formData.appointmentTime)

        // Set DateRestit to 18:00:00.000
        const formattedDateRestit = convertUtfToLocale(formData.appointmentDate, "18:00")

        // Format Travaux description
        const formattedTravaux = `${motif?.Motif} - PRET VEHICULE = ${formData.rental ? "OUI" : "NON"
            } - CHIFFRAGE = ${formData.chiffrage ? "OUI" : "NON"} - TYPE DE VEHICULE SOUHAITE = ${formData.rentalCategory ?? "SANS OBJET"
            } - TYPE DE TRANSMISSION SOUHAITEE = ${formData.rentalDrive ?? "SANS OBJET"
            } - SANS CONTACT = ${formData.contactless === "true" ? "OUI" : "NON"}`;


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
            NomActivité: formData.rdvCategory || "AucunP",
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
            IDMotifRDV: motif?.IDMotifRDV ?? formData.task,
            IDUtilisateur: user.IDUtilisateur ?? null,
            IDVéhicule: 0,
            SaisieDuClient: "",
            Etat: 1,
            Blacklistage: ""

        };

        // Validate Data with ZOD
        rdvWebdevSchema.parse(rdv);

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
            throw error(500, apiResponse.error);
        }

        //SEND_CONFIRMATION_EMAIL
        const response = sendRdvEmail(user, formData, motif!);

        if (!response.success) {
            throw error(500, response?.error as string);
        }

        return {
            success: true,
            error: "",
            data: apiResponse.data
        }
    }
    catch (error) {
        console.error("Erreur :", error);
        return {
            success: false,
            error: "Une erreur s'est produite lors de la prise de RDV."
        }

    }
}