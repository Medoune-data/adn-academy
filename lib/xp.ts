export interface BadgeLevel {
  key: string;
  label: string;
  icon: string;
  minXp: number;
}

export const BADGE_LEVELS: BadgeLevel[] = [
  { key: "debutant", label: "Débutant", icon: "🥉", minXp: 0 },
  { key: "analyste-junior", label: "Analyste Junior", icon: "🥈", minXp: 150 },
  { key: "analyste", label: "Analyste", icon: "🥇", minXp: 400 },
  { key: "expert", label: "Expert", icon: "💎", minXp: 800 },
  { key: "master-data", label: "Master Data", icon: "👑", minXp: 1500 },
];

export function getBadgeForXp(xp: number): BadgeLevel {
  return [...BADGE_LEVELS].reverse().find((b) => xp >= b.minXp) ?? BADGE_LEVELS[0];
}

export function getNextBadge(xp: number): BadgeLevel | null {
  return BADGE_LEVELS.find((b) => b.minXp > xp) ?? null;
}

/**
 * XP gagné pour une partie solo : base par bonne réponse + bonus de vitesse.
 * timeMs = temps mis à répondre, maxMs = temps limite de la question.
 */
export function computeAnswerXp(correct: boolean, timeMs: number, maxMs: number): number {
  if (!correct) return 0;
  const speedRatio = Math.max(0, 1 - timeMs / maxMs); // 1 = instantané, 0 = juste à temps
  const base = 10;
  const speedBonus = Math.round(speedRatio * 10);
  return base + speedBonus;
}
