import { jwtVerify, decodeJwt } from "jose";
import { fail, redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';
import type { Cookies } from "@sveltejs/kit";

import type { WebdevUser } from "$lib/utils/types";

const secretKey = new TextEncoder().encode(JWT_SECRET); // Convert secret to Uint8Array

export async function getToken(cookies: Cookies) {
    return cookies.get("auth_token") || null;

}

export async function getUserData(token :string): Promise<WebdevUser | null> {

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as WebdevUser; // Cast payload to your user type
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export async function getUser(cookies :Cookies): Promise<WebdevUser | null> {
    const token = cookies.get("auth_token");

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as WebdevUser; // Cast payload to your user type
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export async function getUserOrRedirect() {
    const user = await getUserData();
    if (!user) {
        redirect("/"); // Next.js `redirect()` auto-throws
    }
    console.log(user);
    return user;
}


export function isTokenExpired(token: string): boolean {
    try {
        // Decode the token without verifying the signature
        const decoded = decodeJwt(token);

        // Get the expiration time from the decoded token (exp is in seconds)
        const expirationTime = decoded.exp;

        // Check if the token is expired (current time in seconds)
        return expirationTime < Math.floor(Date.now() / 1000);
    } catch (error) {
        console.error('Failed to decode token', error);
        return true; // If there's an error decoding, consider it expired
    }
}