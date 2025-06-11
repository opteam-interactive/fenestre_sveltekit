import { encodeBase64, fetchToApi } from "$lib/server/utils/webdev"
import type { FormattedResponse, Motif, MotifName, MotifWithQuestions } from "$lib/types/types"
import { motifQuestions } from "$lib/client/constants";


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

export const getMotifsWithQuestions = async (): Promise<FormattedResponse<MotifWithQuestions[]>> => {
        //Note : this is ok as long as there are not too many motifs, if there are too many, we should use a different approach and fetch the details only for the selected one
    try {
        const SQL = "SELECT * FROM MotifRDV WHERE NomActivité <> 'AucunP' ORDER BY Motif ASC "
        const encodedSQL = encodeBase64(SQL)
        const response = await fetchToApi(encodedSQL)
        if (!response.success) {
            throw new Error(response.error)
        }

        const motifsList: Motif[] = response.data

        const motifsWithQuestions = motifsList.map(motif => {
            const detailsArray =  motifQuestions.filter(question => question.idMotifRDV === motif.IDMotifRDV)
            return {
                ...motif,
                details: detailsArray[0]
            }
        })
      
        return {
            success: true,
            data: motifsWithQuestions
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
    } catch (err) {
        console.error(err);
        throw err
    }


}