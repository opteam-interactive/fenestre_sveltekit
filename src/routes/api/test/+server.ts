import type { RequestHandler } from '@sveltejs/kit';
import { getMotifs } from '$lib/server/services/motifServices';
export const GET: RequestHandler = async ({ url }) => {

    const response = await getMotifs();
    if (!response.success) {
        return Response.json({ error: response.error }, { status: 500 });
    }
    const motifs = response.data

    return Response.json(motifs, { status: 200 });
}