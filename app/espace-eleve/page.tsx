"use client";

import { useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { FORMATIONS } from "@/lib/formations";
import { daysLeft, formatDate, memberSince, membershipStatus } from "@/lib/membership";
import { getCell } from "@/lib/cells";

function Dashboard() {
  const { user, profile } = useAuth();
  const enrolled = profile?.enrolledFormations ?? [];
  const myFormations = FORMATIONS.filter((f) => enrolled.includes(f.slug));

  // Abonnement et carte membre
  const status = membershipStatus(profile?.paidUntil);
  const left = daysLeft(profile?.paidUntil);
  const cell = getCell(profile?.cell);
  const [cardLoading, setCardLoading] = useState(false);

  const statusText =
    status === "expired"
      ? `Expiré le ${formatDate(profile?.paidUntil)}`
      : status === "active" || status === "soon"
      ? `Actif jusqu'au ${formatDate(profile?.paidUntil)} (${left} j)`
      : "";
  const statusClass =
    status === "expired" ? "text-red-500" : status === "soon" ? "text-amber" : "text-accent";
  const renewUrl = `https://wa.me/2250564094530?text=${encodeURIComponent(
    `Bonjour, je souhaite renouveler mon abonnement ADN. Carte n° ${profile?.cardNumber ?? ""}`
  )}`;

  const downloadCard = async () => {
    if (!profile?.cardId || !profile.cardNumber || !cell) return;
    setCardLoading(true);
    try {
      const { generateMemberCardPNG } = await import("@/lib/generateMemberCard");
      await generateMemberCardPNG({
        name: profile.name || user?.displayName || "Membre ADN",
        cardNumber: profile.cardNumber,
        cardId: profile.cardId,
        cell,
        since: memberSince(profile.createdAt),
      });
    } catch (e) {
      alert("Impossible de générer la carte pour le moment.");
      console.error(e);
    } finally {
      setCardLoading(false);
    }
  };

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

        {profile?.cardNumber && (
          <div className="border border-border rounded-2xl p-6 bg-surface mb-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-faint mb-2">
                Carte membre{cell ? ` · Cellule de ${cell.name}` : ""}
              </p>
              <p className="font-mono text-sm text-text mb-2">{profile.cardNumber}</p>
              {statusText && (
                <p className={`text-[11px] font-mono uppercase tracking-widest font-bold ${statusClass}`}>
                  {statusText}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.cardId && cell && (
                <button
                  onClick={downloadCard}
                  disabled={cardLoading}
                  className="text-[10px] uppercase tracking-widest font-bold border border-accent/30 text-accent px-4 py-2.5 rounded-full hover:bg-accent hover:text-bg transition-all disabled:opacity-50"
                >
                  {cardLoading ? "Génération..." : "↓ Ma carte"}
                </button>
              )}
              {(status === "soon" || status === "expired") && (
                <a
                  href={renewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-widest font-bold bg-accent text-bg px-4 py-2.5 rounded-full hover:brightness-105 transition-all"
                >
                  Renouveler
                </a>
              )}
            </div>
          </div>
        )}

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
              className="inline-block bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-6 py-3.5 rounded-full hover:brightness-110 transition-all"
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
