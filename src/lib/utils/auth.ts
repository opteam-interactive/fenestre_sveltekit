import { jwtVerify } from "jose";
import { fail, redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';
import type { Cookies } from "@sveltejs/kit";

import type { WebdevUser } from "$lib/utils/types";

const secretKey = new TextEncoder().encode(JWT_SECRET); // Convert secret to Uint8Array

export async function getToken(cookies: Cookies) {
    return cookies.get("auth_token") || null;

}

export async function getUserData(cookies: Cookies): Promise<WebdevUser | null> {
    if (!(await isLoggedIn())) {
        return null;
    }

    const token = await getToken(cookies);
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

export async function isLoggedIn(): Promise<boolean> {
    return !!(await getToken()); // Check if token exists
}
