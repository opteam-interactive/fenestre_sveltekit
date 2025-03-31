
import * as jose from "jose";
import type { Cookies } from "@sveltejs/kit";
import { JWT_SECRET } from "$env/static/private";


export async function getToken(cookies: Cookies) {
    return cookies.get("auth_token") || null;

}



export async function checkAuth(cookies : Cookies) {
    
    const token = cookies.get("auth_token");

    if (!token) {
        return { authenticated: false, user: null };
    }

    
    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secretKey);
        return { authenticated: true, user: payload };
        
    } catch (error) {
        console.error("JWT validation error:", error);

        // If token is expired or invalid, remove it
        cookies.delete("auth_token", { path: "/" });

        return { authenticated: false, user: null };
    }
}
