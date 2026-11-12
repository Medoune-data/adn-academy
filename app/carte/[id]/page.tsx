"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { daysLeft, formatDate } from "@/lib/membership";

interface Card {
  name: string;
  cardNumber: string;
  paidUntil?: unknown;
}

export default function VerifyCardPage() {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "cards", id));
        if (snap.exists()) setCard(snap.data() as Card);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 border border-border-strong border-t-accent rounded-full animate-spin" />
        <p className="text-text-faint font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Vérification de la carte...
        </p>
      </main>
    );
  }

  if (!card) {
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen">
        <div className="max-w-lg mx-auto text-center border border-red-500/20 bg-red-500/5 rounded-2xl p-14">
          <h1 className="font-display italic text-2xl text-text mb-4">Carte introuvable</h1>
          <p className="text-text-dim text-sm font-light">
            Ce QR code ne correspond à aucune carte membre ADN.
          </p>
          <Link href="/" className="inline-block mt-8 text-[10px] font-mono uppercase tracking-widest text-accent hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  const left = daysLeft(card.paidUntil);
  const active = left !== null && left > 0;

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-lg mx-auto text-center border border-border bg-surface/60 rounded-2xl p-12">
        <span
          className={`inline-block px-5 py-2 rounded-full border text-[11px] font-bold uppercase tracking-widest mb-8 ${
            active
              ? "border-accent/40 bg-accent-dim text-accent"
              : "border-red-500/40 bg-red-500/10 text-red-500"
          }`}
        >
          {active ? "Membre actif" : "Abonnement expiré"}
        </span>
        <h1 className="font-display text-3xl text-text mb-2 uppercase tracking-tight">{card.name}</h1>
        <p className="font-mono text-sm text-text-dim mb-6">{card.cardNumber}</p>
        <p className="text-text-faint text-xs font-mono">
          {active ? `Valide jusqu'au ${formatDate(card.paidUntil)}` : `Expiré le ${formatDate(card.paidUntil)}`}
        </p>
      </div>
    </main>
  );
}
