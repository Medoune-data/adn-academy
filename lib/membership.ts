import type { Timestamp } from "firebase/firestore";

export const PLANS = [
  { amount: 1000, label: "Membre — 1 000 F" },
  { amount: 1500, label: "Membre+ — 1 500 F" },
] as const;

export const PERIOD_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export function planLabel(amount?: number) {
  return PLANS.find((p) => p.amount === amount)?.label ?? "Membre";
}

function toDate(v: unknown): Date | null {
  if (v && typeof v === "object" && "toDate" in v) {
    return (v as Timestamp).toDate();
  }
  return null;
}

/** Jours restants (négatif si expiré, null si aucun paiement enregistré). */
export function daysLeft(paidUntil: unknown): number | null {
  const d = toDate(paidUntil);
  if (!d) return null;
  return Math.ceil((d.getTime() - Date.now()) / DAY_MS);
}

/** Nouvelle date d'expiration : on repart de la fin actuelle si l'abonnement
 *  court encore (pas de jours perdus en payant en avance), sinon d'aujourd'hui. */
export function nextExpiry(current: unknown): Date {
  const cur = toDate(current);
  const base = cur && cur.getTime() > Date.now() ? cur : new Date();
  return new Date(base.getTime() + PERIOD_DAYS * DAY_MS);
}

export function formatDate(v: unknown): string {
  const d = toDate(v);
  return d
    ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "—";
}

export function generateCardNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `ADN-${new Date().getFullYear()}-${rand}`;
}
