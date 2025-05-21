import type { Motif, RendezVous, ResponseWithData, WebdevRendezVous, User, WebdevUser, FormattedResponse } from "$lib/types/types";
import { error } from '@sveltejs/kit';
import { convertUtfToLocale } from "$lib/server/utils/date";
import { fetchToApi, encodeBase64 } from "$lib/server/utils/utils";
import { format } from 'date-fns';
import { rdvWebdevSchema } from "$lib/types/zod";
import { sendRdvEmail } from "$lib/server/email/RdvEmail";

export const getUserRdvs = async (userId: number): Promise<WebdevRendezVous[] | null> => {

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
