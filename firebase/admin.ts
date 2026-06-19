import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

// Initialize Firebase Admin SDK lazily
export async function getFirebaseAdmin(): Promise<{ auth: Auth | null; db: Firestore | null }> {
    if (authInstance && dbInstance) {
        return { auth: authInstance, db: dbInstance };
    }

    try {
        const { getApps, initializeApp, cert } = await import("firebase-admin/app");
        const { getAuth } = await import("firebase-admin/auth");
        const { getFirestore } = await import("firebase-admin/firestore");

        const apps = getApps();

        if (!apps.length) {
            // Validate that all required environment variables are present
            if (
                !process.env.FIREBASE_PROJECT_ID ||
                !process.env.FIREBASE_CLIENT_EMAIL ||
                !process.env.FIREBASE_PRIVATE_KEY
            ) {
                console.warn(
                    "⚠️  Firebase Admin credentials not configured. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env.local file."
                );
                return { auth: null, db: null };
            }

            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    // Replace escaped newlines with actual newlines
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                }),
            });
        }

        authInstance = getAuth();
        dbInstance = getFirestore();
    } catch (error) {
        console.error("❌ Failed to initialize Firebase Admin:", error instanceof Error ? error.message : String(error));
        console.warn("Please verify your Firebase credentials in the .env.local file are correctly formatted.");
        return { auth: null, db: null };
    }

    return {
        auth: authInstance,
        db: dbInstance,
    };
}