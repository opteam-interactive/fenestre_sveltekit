import { encodeBase64, fetchToApi } from "$lib/utils/utils"

const getMotifByID = async (id: number) => {
    const SQL = `SELECT * FROM Motif WHERE IDMotifRDV = ${id}`
    const encodedSQL = encodeBase64(SQL)

    const response = await fetchToApi(encodedSQL)

    if (!response.success) {
        return null
    }

    return response.data
}