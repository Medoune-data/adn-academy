"use client";

import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { FORMATIONS } from "@/lib/formations";

function Dashboard() {
  const { user, profile } = useAuth();
  const enrolled = profile?.enrolledFormations ?? [];
  const myFormations = FORMATIONS.filter((f) => enrolled.includes(f.slug));

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <p className="cell-label mb-4">A1 — Espace élève</p>
        <h1 className="font-display italic text-3xl md:text-5xl text-text mb-3">
          Bienvenue{user?.displayName ? `, ${user.displayName}` : ""}.
        </h1>
        <p className="text-text-dim font-light mb-14">
          Retrouve ici les rediffusions et fichiers de tes formations en cours.
        </p>

        {myFormations.length === 0 ? (
          <div className="border border-border rounded-2xl p-10 bg-surface/40 text-center">
            <p className="text-text-dim font-light mb-6">
              Aucune formation active sur ton compte pour le moment. Une fois ton
              inscription confirmée via WhatsApp, ta formation apparaîtra ici
              automatiquement.
            </p>
            <a
              href="https://wa.me/2250564094530?text=Bonjour%2C%20je%20souhaite%20activer%20l%27acc%C3%A8s%20%C3%A0%20ma%20formation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-6 py-3.5 rounded-md hover:brightness-110 transition-all"
            >
              Contacter l&apos;équipe →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myFormations.map((f) => (
              <Link
                key={f.slug}
                href={`/espace-eleve/${f.slug}`}
                className="border border-border rounded-2xl p-8 bg-surface/40 hover:border-accent/40 transition-all"
              >
                <span className="font-mono text-[10px] text-text-faint block mb-4">{f.cellRef}</span>
                <h3 className="font-display italic text-xl text-text mb-3">{f.title}</h3>
                <span className="text-[10px] uppercase tracking-widest text-accent">
                  Accéder aux ressources →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function EspaceElevePage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}
