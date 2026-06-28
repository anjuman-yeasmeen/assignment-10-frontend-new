import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase is only used for Google sign-in; treat it as optional until configured.
export const firebaseEnabled = Boolean(config.apiKey && config.projectId);

let app = null;
let auth = null;

if (firebaseEnabled) {
  app = getApps().length ? getApp() : initializeApp(config);
  auth = getAuth(app);
}

const googleProvider = new GoogleAuthProvider();

export async function googleSignIn() {
  if (!auth) {
    throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars.");
  }
  const result = await signInWithPopup(auth, googleProvider);
  const { displayName, email, photoURL } = result.user;
  return { name: displayName, email, photo: photoURL };
}
