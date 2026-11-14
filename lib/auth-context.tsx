"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot, type Timestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

interface StudentProfile {
  name?: string;
  whatsapp?: string;
  enrolledFormations?: string[];
  xp?: number;
  // Abonnement et carte membre (écrits uniquement par l'admin)
  cell?: string;
  cardId?: string;
  cardNumber?: string;
  plan?: number;
  paidUntil?: Timestamp;
  createdAt?: Timestamp;
}

interface AuthContextValue {
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubProfile?.();
      unsubProfile = null;
      setUser(firebaseUser);

      if (firebaseUser) {
        // Profil en direct : un paiement enregistré par l'admin met à jour
        // l'abonnement de l'élève sans qu'il ait à se reconnecter.
        // On attend le premier résultat avant de passer loading à false,
        // comme avant (sinon les pages afficheraient un profil vide).
        await new Promise<void>((resolve) => {
          let first = true;
          const done = () => {
            if (first) {
              first = false;
              resolve();
            }
          };
          unsubProfile = onSnapshot(
            doc(db, "students", firebaseUser.uid),
            (snap) => {
              setProfile(snap.exists() ? (snap.data() as StudentProfile) : {});
              done();
            },
            () => {
              setProfile({});
              done();
            }
          );
        });

        try {
          const adminSnap = await getDoc(doc(db, "admins", firebaseUser.uid));
          setIsAdmin(adminSnap.exists());
        } catch {
          setIsAdmin(false);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubProfile?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
