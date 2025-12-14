'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK_MS = 60 * 60 * 24 * 7 * 1000;
const ONE_WEEK_SEC = 60 * 60 * 24 * 7;

export async function signup(params) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return { success: false, message: "User already exists." };
        }

        await db.collection('users').doc(uid).set({ name, email });

        return { success: true, message: "Account created successfully." };
    } catch (error) {
        console.error("Error in signup:", error);
        return { success: false, message: "Failed to create an account." };
    }
}

export async function signIn(params) {
    const { email, idToken } = params;

    try {
        await auth.getUserByEmail(email);
        await setSessionCookie(idToken);

        return { success: true, message: "Logged in successfully." };
    } catch (error) {
        console.error("Error in signIn:", error);
        return { success: false, message: "Failed to log into an account." };
    }
}

export async function setSessionCookie(idToken) {
    const cookieStore = cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK_MS,
    });

    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK_SEC,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export async function getCurrentUser() {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists) return null;

        return {
            id: userRecord.id,
            ...userRecord.data(),
        };
    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}