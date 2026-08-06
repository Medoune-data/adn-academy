export function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  // Déjà un ID brut (11 caractères typiques, pas d'URL)
  if (!trimmed.includes("/") && !trimmed.includes(".")) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.replace("/embed/", "");
      }
      const v = url.searchParams.get("v");
      if (v) return v;
    }
  } catch {
    // pas une URL valide, on retourne tel quel
  }
  return trimmed;
}

export type FichierType = "excel" | "pdf" | "sql" | "r";

export function guessFileType(filename: string): FichierType {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (["xlsx", "xls", "csv"].includes(ext)) return "excel";
  if (["sql"].includes(ext)) return "sql";
  if (["r", "rmd"].includes(ext)) return "r";
  return "pdf";
}

/**
 * Extrait le numéro d'une séance à partir du libellé "Semaine" (ex:
 * "Semaine 3" → 3). Utilisé pour trier les séances dans le bon ordre —
 * le champ "date" est du texte libre saisi à la main, donc trier
 * dessus alphabétiquement ne donne PAS l'ordre chronologique réel.
 */
export function extractSemaineNumber(semaine: string): number {
  const match = semaine.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
