import { encodeBase64, fetchToApi } from "$lib/server/utils/webdev"
import type { FormattedResponse } from "$lib/types/types"
import type { ForfaitLocation } from "$lib/types/types"
export const getForfaitLocation = async (): Promise<FormattedResponse<ForfaitLocation>> => {
    try {
        const SQL = `SELECT Libellé, VarMonétaire FROM Parametres WHERE Libellé = 'MtForfaitJournPEU' OR Libellé = 'MtForfaitKmsPEU'`
        const encodedSQL = encodeBase64(SQL)

        const response = await fetchToApi(encodedSQL)

        if (!response.success) {
            throw new Error(response.error)
        }

        if (!response.data[0]) {
           throw new Error("No data found")
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
        if (error instanceof Error) {
           throw new Error(error.message)
        }
        throw new Error("An unexpected error occurred in the getForfaitLocation function")
    }

}