import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
    const apps = getApps();

    if (!apps.length) {
        try {
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
        } catch (error) {
            console.error("❌ Failed to initialize Firebase Admin:", error instanceof Error ? error.message : String(error));
            console.warn("Please verify your Firebase credentials in the .env.local file are correctly formatted.");
            return { auth: null, db: null };
        }
    }

    return {
        auth: getAuth(),
        db: getFirestore(),
    };
}

export const { auth, db } = initFirebaseAdmin();