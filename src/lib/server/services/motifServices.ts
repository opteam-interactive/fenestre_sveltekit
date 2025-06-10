import { encodeBase64, fetchToApi } from "$lib/server/utils/webdev"
import type { FormattedResponse, Motif, MotifName } from "$lib/types/types"

export const getMotifs = async (): Promise<FormattedResponse<Motif[]>> => {
    try {
        const SQL = 'SELECT * FROM MotifRDV ORDER BY Motif ASC'
        const encodedSQL = encodeBase64(SQL)
        const response = await fetchToApi(encodedSQL)
        if (!response.success) {
            throw new Error(response.error)
        }

        const motifs: Motif[] = response.data
        return {
            success: true,
            data: motifs
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
       throw new Error("An unexpected error occurred in the getMotifs function");
    }

}
export const getMotifsList = async (): Promise<FormattedResponse<MotifName[]>> => {
    try {
        const SQL = 'SELECT IDMotifRDV, Motif FROM MotifRDV ORDER BY Motif ASC'
        const encodedSQL = encodeBase64(SQL)
        const response = await fetchToApi(encodedSQL)
        if (!response.success) {
            throw new Error(response.error)
        }

        const motifsList: MotifName[] = response.data
        return {
            success: true,
            data: motifsList
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred in the getMotifsList function");
    }

}

export const getMotifByID = async (id: number): Promise<FormattedResponse<Motif>> => {
    try {
        const SQL = `SELECT * FROM MotifRDV WHERE IDMotifRDV = ${id} `
        const encodedSQL = encodeBase64(SQL)
        const response = await fetchToApi(encodedSQL)


        if (!response.success) {
            throw new Error(response.error)
        }
        const motif: Motif = response.data[0]

        return {
            success: true,
            data: motif
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
throw new Error("An unexpected error occurred in the getMotifByID function");
}


}