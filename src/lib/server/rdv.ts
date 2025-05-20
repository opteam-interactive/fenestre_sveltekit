import type { Motif, RendezVous, ResponseWithData, WebdevRendezVous, User, WebdevUser } from "$lib/types/types";
import { error } from '@sveltejs/kit';
import { convertUtfToLocale } from "$lib/utils/date";
import { fetchToApi, encodeBase64 } from "$lib/utils/utils";
import { format } from 'date-fns';
import { rdvWebdevSchema } from "$lib/types/zod";
import { sendRdvEmail } from "$lib/server/email/RdvEmail";

export async function getUserRdvs(userId: number) {

    // const SQL = `SELECT * FROM RendezVous WHERE IDUtilisateur = ${userId} AND DateRestit >= GETDATE()`
    const SQL = `SELECT * FROM RendezVous WHERE IDUtilisateur = ${userId} `
    const encodedSQL = encodeBase64(SQL)
    try {
        const response = await fetchToApi(encodedSQL);
        if (response.error == 'FALSE') {
            console.error("ERROR")
            return null
        }
        const userRdvs: WebdevRendezVous[] | null = response.data
        return userRdvs

    } catch (error) {
        console.error(error)
        return null
    }
}

export async function createRdv(formData: RendezVous, motifs: Motif[], user: WebdevUser): ResponseWithData<WebdevRendezVous> {
    try {

        //Find motif from its ID
        const selectedMotif = motifs.find((motif) => motif.IDMotifRDV === formData.task)

        // Get DateRecept in UTC time
        const formattedDateRecept = convertUtfToLocale(formData.appointmentDate, formData.appointmentTime)

        // Set DateRestit to 18:00:00.000
        const formattedDateRestit = convertUtfToLocale(formData.appointmentDate, "18:00")

        // Format Travaux description
        const formattedTravaux = `${selectedMotif?.Motif} - PRET VEHICULE = ${formData.rental ? "OUI" : "NON"
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
            NbHeureTx: parseFloat(parseFloat(selectedMotif?.TempsEstimé!).toFixed(2)),
            Observations: "",
            IDVoiturePret: 0,
            ClientAssurance: " ",
            Cdé: false,
            // DépotSansContact: formData.contactless === "true" ? true : false,
            DépotSansContact: false,
            CréateurDateh: format(new Date(), "yyyyMMddHHmmssSSS"),
            ModifieurDateh: "",
            ModifieurID: 0,
            IDMotifRDV: selectedMotif?.IDMotifRDV ?? formData.task,
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
        const response = sendRdvEmail(user, formData, selectedMotif!);

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