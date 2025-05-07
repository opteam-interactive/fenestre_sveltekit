import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types';
import { checkAuth } from "$lib/server/jwt";
import { getUser } from "$lib/server/user";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    console.log("load")
    const isLoginRoute = url.pathname == "/";
    const isRegisterRoute = url.pathname == "/register";

    const { authenticated, user } = await checkAuth(cookies)

    if (!authenticated) {
        console.log("not authenticated")
        if (!isLoginRoute && !isRegisterRoute) {
            throw redirect(303, "/");
        }
    }

    return { user };
}

