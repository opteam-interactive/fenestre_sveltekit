
import * as jose from "jose";
import type { Cookies } from "@sveltejs/kit";
import { JWT_SECRET } from "$env/static/private";
import type { FormattedResponse, UserJwtPayload, WebdevUser } from "$lib/types/types";


export async function getToken(cookies: Cookies) {
    try {
        const cookie = cookies.get("auth_token");
        if (cookie) {
            return cookie;
        }
        return null;
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred in the getToken function");
    }

}

export async function updateToken(cookies: Cookies, user: WebdevUser): Promise<FormattedResponse> {
    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const token = await new jose.SignJWT(user).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(secretKey);
        cookies.set("auth_token", token, { path: "/" });
        return { success: true }; 

    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred in the updateToken function");
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
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred in the getcheckAuthToken function");
    }
}
