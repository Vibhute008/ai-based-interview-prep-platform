import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4SZqCsVMAt_kiovSwCESTlcIGUOIq2tM",
  authDomain: "voiceagent-3a24f.firebaseapp.com",
  projectId: "voiceagent-3a24f",
  storageBucket: "voiceagent-3a24f.firebasestorage.app",
  messagingSenderId: "368979487",
  appId: "1:368979487:web:9e540229c1bd409c2c6f2a",
  measurementId: "G-JX0EBSZRHD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

if (typeof window !== "undefined") {
  getAnalytics(app);
}