import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { rdvSchema, rdvWebdevSchema } from '$lib/utils/zod';
import type { WebdevRendezVous } from '$lib/utils/types'
import { type Infer, message } from 'sveltekit-superforms';
import { getMotifs } from '$lib/utils/requests';
import { z } from 'zod'
import { format } from 'date-fns'
import { fetchToApi, encodeBase64 } from '$lib/utils/utils.js';
import { fail } from '@sveltejs/kit';
import type { Motif } from '$lib/utils/types';
type Message = { status: 'error' | 'success' | 'warning'; text: string };


const motifs: Motif[] = await getMotifs();

// Initialize superforms
export const load = async () => {
    const form = await superValidate<Infer<typeof rdvSchema>, Message>(zod(rdvSchema));
   
    return { form, motifs };
};

//POST_ACTION
export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(rdvSchema));


        if (!form.valid) {
            // Return { form } and things will just work.
            return message(form, {
                status: 'error',
                text: 'La prise de RDV a échoué'
            });

        }

        //GET_USER
        //TODO


       

        try {
            //Find motif from its ID
            const selectedMotif = motifs.find((motif) => motif.IDMotifRDV === form.data.task)

            // Add hours to the DateRecept
            const formattedDateRecept = form.data.appointmentDate
            const [hours, minutes] = form.data.appointmentTime.split(":").map(Number);
            formattedDateRecept.setHours(hours, minutes, 0, 0);

            // Set DateRestit to 18:00:00.000
            const formattedDateRestit = form.data.appointmentDate;
            formattedDateRestit.setHours(18, 0, 0, 0);


            // Format Travaux description
            const formattedTravaux = `${selectedMotif?.Motif} - PRET VEHICULE = ${form.data.rental ? "OUI" : "NON"
                } - CHIFFRAGE = ${form.data.chiffrage ? "OUI" : "NON"} - TYPE DE VEHICULE SOUHAITE = ${form.data.rentalCategory ?? "SANS OBJET"
                } - TYPE DE TRANSMISSION SOUHAITEE = ${form.data.rentalDrive ?? "SANS OBJET"
                } - SANS CONTACT = ${form.data.contactless === "true" ? "OUI" : "NON"}`;

            // Build RDV Object
            const rdv: WebdevRendezVous = {
                NomSite: "PEUGEOT",
                DateRécept: format(formattedDateRecept, "yyyyMMddHHmmssSSS"),
                DateRestit: format(formattedDateRestit, "yyyyMMddHHmmssSSS"),
                Client: `${user.Société ?? ""} ${user.Nom ?? ""} ${user.Prénom ?? ""}`.trim(),
                Téléphone: user.Téléphone ?? "",
                Mobile: user.Téléphone ?? "",
                ClientEmail: user.Email,
                ClientAdresse: user.Adresse ?? "",
                ClientCP: user.cp ?? "",
                ClientVille: user.Ville ?? "",
                Marque: form.data.brand,
                Modèle: form.data.model,
                Version: "",
                immatriculation: form.data.plateNumber,
                Travaux: formattedTravaux,
                NomActivité: form.data.rdvCategory || "AucunP",
                NbHeureTx: parseFloat(parseFloat(form.data.task.TempsEstimé).toFixed(2)),
                Observations: "",
                IDVoiturePret: 0,
                ClientAssurance: " ",
                Cdé: false,
                // DépotSansContact: form.data.contactless === "true" ? true : false,
                DépotSansContact: false,
                CréateurDateh: format(new Date(), "yyyyMMddHHmmssSSS"),
                ModifieurDateh: "",
                ModifieurID: 0,
                IDMotifRDV: form.data.task,
                IDUtilisateur: user.IDUtilisateur ?? null,
                IDVéhicule: 0,
                SaisieDuClient: "",
                Etat: 1,
                Blacklistage: null,

            };
            console.log(rdv);

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
 '${rdv.NomSite}', '${rdv.DateRécept}', '${rdv.DateRestit}', '${rdv.Client}', 
 '${rdv.Téléphone}', '${rdv.Mobile}', '${rdv.ClientEmail}', '${rdv.ClientAdresse}', 
 '${rdv.ClientCP}', '${rdv.ClientVille}', '${rdv.Marque}', '${rdv.Modèle}', 
 '${rdv.Version}', '${rdv.immatriculation}', '${rdv.Travaux}', '${rdv.NomActivité}', 
 ${rdv.NbHeureTx}, '${rdv.Observations}', '${rdv.IDVoiturePret}', '${rdv.ClientAssurance}', 
 ${rdv.Cdé === null ? "NULL" : `'${rdv.Cdé}'`}, ${rdv.DépotSansContact ? 1 : 0}, 
 '${rdv.CréateurDateh}', ${rdv.ModifieurDateh === null ? "NULL" : `'${rdv.ModifieurDateh}'`}, 
 ${rdv.ModifieurID === null ? "NULL" : `'${rdv.ModifieurID}'`}, '${rdv.IDMotifRDV}', 
 ${rdv.IDUtilisateur === null ? "NULL" : `'${rdv.IDUtilisateur}'`}, 
 ${rdv.IDVéhicule === null ? "NULL" : `'${rdv.IDVéhicule}'`}, 
 ${rdv.SaisieDuClient === null ? "NULL" : `'${rdv.SaisieDuClient}'`}, 
 ${rdv.Etat === null ? "NULL" : `'${rdv.Etat}'`}, ${rdv.Blacklistage}
);
`;


            const encodedSQL = encodeBase64(SQL);

            const apiResponse = await fetchToApi(encodedSQL);
            if (!apiResponse.success) {
                // Gestion des erreurs de l'API externe
                return Response.json(
                    { error: apiResponse.error },
                    { status: apiResponse.status || 500 } // Utilisez le code d'état de l'API ou 500 par défaut
                );
            }
            return message(form, {
                status: 'success',
                text: 'Prise de RDV reussie !'
            });
        }
        catch (error) {
            console.error("Erreur :", error);
            return message(form, {
                status: 'error',
                text: 'Erreur lors de la prise de RDV'
            })

        }




        // Return the form with a status message

    }
};