import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/jwt.js';

export const handle: Handle = async ({ event, resolve }) => {

    if (! event.url.pathname.startsWith('/espace-client')) {
        const { authenticated, user } = await checkAuth(event.cookies)
        if (authenticated && user) {
            throw redirect(303, '/espace-client');
        }

        return await resolve(event);
    }

    if (event.url.pathname.startsWith('/espace-client')) {

        const { authenticated, user } = await checkAuth(event.cookies)
        if (!authenticated || !user) {
            throw redirect(303, '/');
        }
        event.locals.user = user
    }

    const response = await resolve(event);
    return response;
};