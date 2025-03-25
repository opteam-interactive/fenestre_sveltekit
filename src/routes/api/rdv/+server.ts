import type { WebdevRendezVous } from "$lib/utils/types";
import { fetchToApi, encodeBase64 } from "$lib/utils/utils"; // Your existing fetch function
import type { RequestHandler } from '../../espace-client/prendre-rdv/$types';

interface Erreur {
    erreur: string;
}
export  const GET: RequestHandler = async ({url}) => {

    const date = String(url.searchParams.get('date') ?? '');
    if (!date) {
        return Response.json({ error: "Missing date parameter" }, { status: 400 });
    }
    console.log(date)

    // const formattedDate= date.toString().replace(/-/g, "");
    // const startDate = `${formattedDate}000000000`; // 00:00:00.000
    // const endDate = `${formattedDate}235959999`;


    const startDate = `${date}T00:00:00.000`; // 00:00:00.000

    const endDate = `${date}T23:59:59.999`;




    try {
        // Fetch RDVs only for the selected date
        const SQL = `SELECT RendezVous.IDRendezVous, RendezVous.DateRécept, RendezVous.DateRestit, RendezVous.IDMotifRDV, RendezVous.Etat FROM RendezVous WHERE  ( RendezVous.DateRécept >= '${startDate}' AND RendezVous.DateRécept <= '${endDate}' )`;
        const encodedSQL = encodeBase64(SQL);
        console.log(SQL, encodedSQL)
        const response = await fetchToApi(encodedSQL);

        if (!response.success) {
            return Response.json({ error: response.error }, { status: 500 });
        }

        let responseData: WebdevRendezVous[] | Erreur  = response.data

    
        return Response.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error fetching RDVs:", error);
        return Response.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}
