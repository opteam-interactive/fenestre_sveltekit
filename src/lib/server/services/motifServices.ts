import { encodeBase64 , fetchToApi} from "$lib/server/utils/webdev"
import type { FormattedResponse, Motif } from "$lib/types/types"

export const getMotifs = async () : Promise<FormattedResponse<Motif[]>> => {
    const SQL = 'SELECT * FROM MotifRDV ORDER BY Motif ASC'
    const encodedSQL = encodeBase64(SQL)
    const response = await fetchToApi(encodedSQL)
    if (!response.success) {
        return {
            success: false,
            error: response.error
        }
    }

    const motifs : Motif[] = response.data
    return {
        success: true,
        data: motifs
    }
}

export const getMotifByID = async (id: number) : Promise<FormattedResponse<Motif>> => {

    const SQL = `SELECT * FROM MotifRDV WHERE IDMotifRDV = ${id} `
    const encodedSQL = encodeBase64(SQL)
    const response = await fetchToApi(encodedSQL)
   

    if (!response.success) {
        return {
            success: false,
            error: response.error
        }
    }
    const motif : Motif = response.data[0]

    return {
        success: true,
        data: motif
    }
}