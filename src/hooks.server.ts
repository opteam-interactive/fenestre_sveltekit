import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/utils/jwt';

export const handle: Handle = async ({ event, resolve }) => {

    const authResponse = await checkAuth(event.cookies)
    if (!authResponse) {
        throw new Error('An unexpected error occurred in the checkAuth function');
    }
    const { authenticated, user } = authResponse
   

    if (!event.url.pathname.startsWith('/espace-client') && !event.url.pathname.startsWith('/api')) {
        if (authenticated && user) {
            throw redirect(303, '/espace-client');
        }

        return await resolve(event);
    }

    if (event.url.pathname.startsWith('/espace-client')) {
       
        if (!authenticated || !user) {
            throw redirect(303, '/');
        }
        event.locals.user = user
    }

    const response = await resolve(event);
    return response;
};