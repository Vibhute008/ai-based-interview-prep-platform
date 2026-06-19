"use server";

import { getFirebaseAdmin } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
    const { auth } = await getFirebaseAdmin();
    if (!auth) {
        throw new Error("Firebase Admin auth is not configured");
    }

    const cookieStore = await cookies();

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    const { db } = await getFirebaseAdmin();
    if (!db) {
        return {
            success: false,
            message:
                "Server database is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment.",
        };
    }

    try {
        console.log("SignUp attempt for uid:", uid, "email:", email);

        // check if user exists in db
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists) {
            console.log("User already exists in database");
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };
        }

        // save user to db
        const writeResult = await db.collection("users").doc(uid).set({
            name,
            email,
            createdAt: new Date(),
        });

        console.log("User successfully created in Firestore:", uid);
        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error: any) {
        console.error("Error creating user:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);

        // Handle Firebase specific errors
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use",
            };
        }

        return {
            success: false,
            message: `Failed to create account: ${error.message || "Unknown error"}`,
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    const { auth } = await getFirebaseAdmin();
    if (!auth) {
        return {
            success: false,
            message:
                "Server authentication is not configured. Set Firebase Admin credentials in your environment.",
        };
    }

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord)
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };

        await setSessionCookie(idToken);

        return { success: true };
    } catch (error: any) {
        console.error("Sign in error:", error);

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

// Sign out user by clearing the session cookie
export async function signOut() {
    const cookieStore = await cookies();

    cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;

    try {
        const { auth, db } = await getFirebaseAdmin();
        if (!auth || !db) return null;

        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // get user info from db
        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.log(error);

        // Invalid or expired session
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}