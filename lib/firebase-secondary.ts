import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Créer un compte via createUserWithEmailAndPassword connecte
// automatiquement l'app à ce nouveau compte — ce qui déconnecterait
// l'admin de sa propre session. On utilise donc une seconde instance
// Firebase (même projet, même config) uniquement pour cette opération,
// puis on la déconnecte immédiatement après.
const SECONDARY_APP_NAME = "Secondary";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getSecondaryAuth() {
  const existing = getApps().find((a) => a.name === SECONDARY_APP_NAME);
  const secondaryApp = existing ?? initializeApp(firebaseConfig, SECONDARY_APP_NAME);
  return getAuth(secondaryApp);
}

export function getSecondaryApp() {
  const existing = getApps().find((a) => a.name === SECONDARY_APP_NAME);
  return existing ?? getApp(SECONDARY_APP_NAME);
}
