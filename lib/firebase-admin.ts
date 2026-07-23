import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | null = null;

function getAdminApp(): App {
  if (adminApp) return adminApp;
  const existing = getApps().find((a) => a.name === "adn-admin");
  if (existing) {
    adminApp = existing;
    return adminApp;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Les retours à la ligne de la clé privée sont échappés en \n dans les
  // variables d'environnement — on les restitue ici.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin non configuré : renseigne FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL et FIREBASE_ADMIN_PRIVATE_KEY dans .env.local"
    );
  }

  adminApp = initializeApp(
    { credential: cert({ projectId, clientEmail, privateKey }) },
    "adn-admin"
  );
  return adminApp;
}

/**
 * Vérifie le token d'un élève envoyé depuis le client (via user.getIdToken()).
 * Lève une erreur si le token est invalide/expiré — à appeler dans un try/catch.
 */
export async function verifyStudentToken(idToken: string) {
  const app = getAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken);
  return decoded; // decoded.uid, decoded.email, etc.
}

/** Accès Firestore côté serveur (bypass les règles clientes — usage admin uniquement). */
export function getAdminDb() {
  return getFirestore(getAdminApp());
}
