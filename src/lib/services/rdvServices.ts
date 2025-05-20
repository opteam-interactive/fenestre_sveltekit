import type { FormattedResponse, RendezVous, WebdevRendezVous } from "$lib/types/types";
import { encodeBase64, fetchToApi } from "$lib/utils/utils";

export const getRdvsByUSer = async (id: number): Promise<FormattedResponse<WebdevRendezVous[] >> => {
    try{
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