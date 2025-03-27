import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types';
import { getUser, isTokenExpired } from "$lib/utils/auth";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const isLoginRoute = url.pathname == "/";
    let user = null
    const token = cookies.get("auth_token");
    if (!token || isTokenExpired(token)) {
        if (!isLoginRoute) {
            redirect(303, "/");
        }
    } 
    user = getUser(cookies)
    

    return { user };
}