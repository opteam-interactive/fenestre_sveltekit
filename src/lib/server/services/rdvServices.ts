import type { FormattedResponse, RendezVous, WebdevRendezVous } from "$lib/types/types";
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

        const SQL = `SELECT * FROM RendezVous WHERE DateRécept BETWEEN '${lowerBound}' AND '${upperBound}'`
        console.log(SQL)
    
        const encodedSQL = encodeBase64(SQL)
       

        //TODO : ALWAYS_RETURN_EMPTY_ARRAY
        const response = await fetchToApi(encodedSQL)

      

        if (!response.success || !Array.isArray(response.data)) {
            return {
                success: false,
                error: "empty array",
                data: []
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