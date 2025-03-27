import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const token = cookies.get("auth_token");

    const isLoginRoute = url.pathname == "/";


    if (!token && !isLoginRoute ) {
         redirect(303, "/");
    }

    return { userAuthenticated: !!token };
}