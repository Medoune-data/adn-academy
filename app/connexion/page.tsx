"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/espace-eleve");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen flex items-start justify-center">
      <div className="w-full max-w-md">
        <p className="cell-label mb-4">A1 — Connexion</p>
        <h1 className="font-display italic text-3xl md:text-4xl text-text mb-10">
          Espace élève
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg p-3.5 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg p-3.5 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-light">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-bg py-4 font-mono font-bold uppercase tracking-widest text-xs rounded-md hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter →"}
          </button>
        </form>

        <p className="text-text-dim text-sm font-light mt-8 text-center">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-accent hover:underline">
            Comment m&apos;inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
