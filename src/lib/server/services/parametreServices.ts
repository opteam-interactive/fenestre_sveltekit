import { encodeBase64, fetchToApi } from "$lib/server/utils/utils"
import type { FormattedResponse, WebdevUser } from "$lib/types/types"
import type { ForfaitLocation } from "$lib/types/types"
export const getForfaitLocation = async (): Promise<FormattedResponse<ForfaitLocation>> => {
    try {
        const SQL = `SELECT Libellé, VarMonétaire FROM Parametres WHERE Libellé = 'MtForfaitJournPEU' OR Libellé = 'MtForfaitKmsPEU'`
        const encodedSQL = encodeBase64(SQL)

        const response = await fetchToApi(encodedSQL)

        if (!response.success) {
            return {
                success: false,
                error: response.error
            }
        }

        if (!response.data[0]) {
            return {
                success: false,
                error: "User not found"
            }
        }


        const forfait = {
            journalier: response.data[0]["VarMonétaire"],
            kilometrique: response.data[1]["VarMonétaire"]
        }

        return {
            success: true,
            data: forfait
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: "Unexpected error"
        }
    }

}