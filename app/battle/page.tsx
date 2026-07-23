"use client";

import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { getBadgeForXp, getNextBadge } from "@/lib/xp";

function BattleHub() {
  const { profile } = useAuth();
  const xp = profile?.xp ?? 0;
  const badge = getBadgeForXp(xp);
  const next = getNextBadge(xp);

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <p className="cell-label mb-4">ADN Battle</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-6">
          Affronte la data.
        </h1>
        <p className="text-text-dim font-light leading-relaxed max-w-xl mb-12">
          Teste tes réflexes et tes connaissances Excel, SQL et R — seul contre
          l&apos;IA, ou dans le défi de la semaine face à toute la communauté.
        </p>

        {/* Progression */}
        <div className="border border-border rounded-2xl p-6 bg-surface flex items-center justify-between mb-14">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{badge.icon}</span>
            <div>
              <p className="font-display italic text-lg text-text">{badge.label}</p>
              <p className="text-text-faint text-xs font-mono">{xp} XP</p>
            </div>
          </div>
          {next && (
            <p className="text-text-faint text-xs font-mono text-right">
              {next.minXp - xp} XP avant<br />
              <span className="text-accent">{next.icon} {next.label}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/battle/solo"
            className="group border border-border rounded-3xl p-8 bg-surface hover:border-accent/40 hover:shadow-[0_16px_40px_-24px_rgba(36,30,23,0.25)] transition-all"
          >
            <span className="text-3xl mb-4 block">🤖</span>
            <h2 className="font-display italic text-2xl text-text mb-3 group-hover:text-accent transition-colors">
              Solo vs IA
            </h2>
            <p className="text-text-dim text-sm font-light leading-relaxed mb-6">
              10 questions générées à la volée, adaptées à la formation et au
              niveau de ton choix. Score, temps, explications à la fin.
            </p>
            <span className="text-[10px] uppercase tracking-widest text-accent">Jouer →</span>
          </Link>

          <Link
            href="/battle/hebdo"
            className="group border border-border rounded-3xl p-8 bg-surface hover:border-accent/40 hover:shadow-[0_16px_40px_-24px_rgba(36,30,23,0.25)] transition-all"
          >
            <span className="text-3xl mb-4 block">🔥</span>
            <h2 className="font-display italic text-2xl text-text mb-3 group-hover:text-accent transition-colors">
              Défi hebdomadaire
            </h2>
            <p className="text-text-dim text-sm font-light leading-relaxed mb-6">
              Les mêmes questions pour tout le monde cette semaine. Grimpe dans
              le Top 10 avant dimanche minuit.
            </p>
            <span className="text-[10px] uppercase tracking-widest text-accent">Relever le défi →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function BattlePage() {
  return (
    <RequireAuth>
      <BattleHub />
    </RequireAuth>
  );
}
