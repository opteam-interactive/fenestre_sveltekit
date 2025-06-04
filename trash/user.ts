
import { jwtVerify, decodeJwt } from "jose";
import { error } from '@sveltejs/kit';
import type { User, ResponseWithData, WebdevUser } from "$lib/types/types";
import { registerSchema, type RegisterSchemaType } from "$routes/register/RegisterSchema";
import { JWT_SECRET } from '$env/static/private';
import { encodeBase64, fetchToApi } from "$lib/server/utils/webdev";
import type { Cookies } from "@sveltejs/kit";

const secretKey = new TextEncoder().encode(JWT_SECRET);


export async function getUserData(token: string): Promise<WebdevUser | null> {

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as WebdevUser; // Cast payload to your user type
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export async function getUser(cookies: Cookies): Promise<WebdevUser | null> {
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

