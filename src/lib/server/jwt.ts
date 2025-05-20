
import * as jose from "jose";
import type { Cookies } from "@sveltejs/kit";
import { JWT_SECRET } from "$env/static/private";
import type { ResponseNoData, User, UserJwtPayload, WebdevUser } from "$lib/types/types";


export async function getToken(cookies: Cookies) {
    return cookies.get("auth_token") || null;

}

export async function updateToken(cookies: Cookies, user: WebdevUser): Promise<ResponseNoData> {
    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const token = await new jose.SignJWT(user).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(secretKey);
        cookies.set("auth_token", token, { path: "/" });
        return { success: true }; 

    }
    catch (error) {
        console.error(error);
        return { success: false, error: "Failed to update token" };
    }

}


export async function checkAuth(cookies: Cookies) {

    const token = cookies.get("auth_token");

    if (!token) {
        return { authenticated: false, user: null };
    }
    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secretKey);
        return { authenticated: true, user: payload as UserJwtPayload };

    } catch (error) {
        console.error("JWT validation error:", error);

        // If token is expired or invalid, remove it
        cookies.delete("auth_token", { path: "/" });

        return { authenticated: false, user: null };
    }
}
