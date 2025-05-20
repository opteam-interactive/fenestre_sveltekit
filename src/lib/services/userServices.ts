import { encodeBase64, fetchToApi } from "$lib/utils/utils"
import type { FormattedResponse, WebdevUser } from "$lib/types/types"

export const getUserById = async (id: number): Promise<FormattedResponse<WebdevUser>> => {
    try {
        const SQL = `SELECT * FROM Utilisateur WHERE IDUtilisateur = ${id}`
        const encodedSQL = encodeBase64(SQL)

        const response = await fetchToApi(encodedSQL)

        if (!response.success) {
            return {
                success: false,
                error: response.error
            }
        }

        if(!response.data[0]) {
            return {
                success: false,
                error: "User not found"
            }
        }

        return {
            success: true,
            data: response.data[0]
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: "Unexpected error"
        }
    }

}