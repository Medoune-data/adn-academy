"use client";

import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { getBadgeForXp, getNextBadge } from "@/lib/xp";

const MODES = [
  {
    ref: "A1",
    href: "/battle/solo",
    title: "Solo contre l'IA",
    text: "10 questions générées par l'IA, adaptées à la formation et au niveau que tu choisis. Score, temps et explications à la fin.",
    cta: "Jouer",
  },
  {
    ref: "B1",
    href: "/battle/salle",
    title: "Duel & salle privée",
    text: "Crée une salle, partage le code à tes amis et affrontez-vous en direct, avec un classement en temps réel.",
    cta: "Créer ou rejoindre",
  },
  {
    ref: "C1",
    href: "/battle/hebdo",
    title: "Défi hebdomadaire",
    text: "Les mêmes questions pour toute la communauté cette semaine. Le Top 10 se joue avant dimanche minuit.",
    cta: "Relever le défi",
  },
];

function BattleHub() {
  const { profile } = useAuth();
  const xp = profile?.xp ?? 0;
  const badge = getBadgeForXp(xp);
  const next = getNextBadge(xp);

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <p className="cell-label mb-4">ADN Battle</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-6 leading-tight">
          Teste-toi sur Excel, SQL et R.
        </h1>
        <p className="text-text-dim font-light leading-relaxed max-w-xl mb-12">
          Seul face à l&apos;IA, entre amis, ou dans le défi de la semaine ouvert
          à toute la communauté.
        </p>

        {/* Progression */}
        <div className="border border-border rounded-2xl p-6 bg-surface flex items-center justify-between gap-4 mb-14">
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

        {/* Modes de jeu */}
        <div className="border-y border-border">
          {MODES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group grid grid-cols-[3rem_1fr] md:grid-cols-[3.5rem_16rem_1fr_auto] items-center gap-x-6 gap-y-2 py-8 px-2 border-b border-border last:border-b-0 hover:bg-accent-dim transition-colors"
            >
              <span className="font-mono text-[11px] text-text-faint">{m.ref}</span>
              <h2 className="font-display italic text-xl text-text group-hover:text-accent transition-colors">
                {m.title}
              </h2>
              <p className="col-start-2 md:col-start-auto text-text-dim text-sm font-light leading-relaxed">
                {m.text}
              </p>
              <span className="col-start-2 md:col-start-auto text-[10px] uppercase tracking-widest text-accent">
                {m.cta} →
              </span>
            </Link>
          ))}
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
