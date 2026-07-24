"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { FORMATIONS } from "@/lib/formations";

const DIFFICULTIES = ["Débutant", "Intermédiaire", "Avancé"];

function SalleHub() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"choix" | "creer" | "rejoindre">("choix");
  const [formationSlug, setFormationSlug] = useState(FORMATIONS[0].slug);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [questionCount, setQuestionCount] = useState(8);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/battle/room/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          formationSlug,
          difficulty,
          questionCount,
          hostName: profile?.name || user?.displayName || "Hôte",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/battle/salle/${data.code}`);
    } catch (e) {
      console.error(e);
      setError("Impossible de créer la salle. Réessaie dans un instant.");
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/battle/room/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          code: joinCode,
          name: profile?.name || user?.displayName || "Joueur",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/battle/salle/${data.code}`);
    } catch (e: unknown) {
      const message = e instanceof Error && e.message ? e.message : "Impossible de rejoindre cette salle.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-lg mx-auto">
        <Link href="/battle" className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold mb-8 inline-block">
          ← ADN Battle
        </Link>
        <p className="cell-label mb-4">Duel & Salle privée</p>
        <h1 className="font-display italic text-3xl md:text-4xl text-text mb-10">
          Défie tes amis
        </h1>

        {mode === "choix" && (
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setMode("creer")}
              className="text-left border border-border rounded-2xl p-8 bg-surface hover:border-accent/40 transition-all"
            >
              <span className="text-2xl mb-3 block">🎯</span>
              <h2 className="font-display italic text-xl text-text mb-2">Créer une salle</h2>
              <p className="text-text-dim text-sm font-light">
                Choisis la formation et le niveau, partage le code à tes amis.
              </p>
            </button>
            <button
              onClick={() => setMode("rejoindre")}
              className="text-left border border-border rounded-2xl p-8 bg-surface hover:border-accent/40 transition-all"
            >
              <span className="text-2xl mb-3 block">🔑</span>
              <h2 className="font-display italic text-xl text-text mb-2">Rejoindre avec un code</h2>
              <p className="text-text-dim text-sm font-light">Un ami t&apos;a partagé un code à 6 caractères.</p>
            </button>
          </div>
        )}

        {mode === "creer" && (
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-3 block">
                Formation
              </label>
              <div className="flex flex-wrap gap-2">
                {FORMATIONS.map((f) => (
                  <button
                    key={f.slug}
                    onClick={() => setFormationSlug(f.slug)}
                    className={`text-xs font-mono uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all ${
                      formationSlug === f.slug
                        ? "bg-accent text-bg border-accent"
                        : "border-border-strong text-text-dim hover:border-accent/50"
                    }`}
                  >
                    {f.title.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-3 block">
                Niveau
              </label>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`text-xs font-mono uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all ${
                      difficulty === d
                        ? "bg-accent text-bg border-accent"
                        : "border-border-strong text-text-dim hover:border-accent/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-3 block">
                Nombre de questions
              </label>
              <div className="flex flex-wrap gap-2">
                {[6, 8, 10, 12].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`text-xs font-mono uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all ${
                      questionCount === n
                        ? "bg-accent text-bg border-accent"
                        : "border-border-strong text-text-dim hover:border-accent/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-light">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-full hover:brightness-105 transition-all disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer la salle →"}
              </button>
              <button
                onClick={() => setMode("choix")}
                className="border border-border-strong text-text-dim font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 rounded-full hover:text-text transition-all"
              >
                Retour
              </button>
            </div>
          </div>
        )}

        {mode === "rejoindre" && (
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-3 block">
                Code de la salle
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="EX: 7K2PXM"
                maxLength={6}
                className="w-full bg-surface border border-border rounded-lg p-4 text-text text-lg font-mono tracking-[0.3em] text-center uppercase outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-light">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleJoin}
                disabled={loading || joinCode.length < 4}
                className="flex-1 bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-full hover:brightness-105 transition-all disabled:opacity-50"
              >
                {loading ? "Connexion..." : "Rejoindre →"}
              </button>
              <button
                onClick={() => setMode("choix")}
                className="border border-border-strong text-text-dim font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 rounded-full hover:text-text transition-all"
              >
                Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SallePage() {
  return (
    <RequireAuth>
      <SalleHub />
    </RequireAuth>
  );
}
