import { FichierType } from "./admin-utils";

export interface FichierRessource {
  nom: string;
  url: string;
  type: FichierType;
}

/**
 * Fichiers téléchargeables par formation puis par séance (clé = le champ
 * "semaine" exactement tel que saisi dans l'admin, ex: "Semaine 1").
 *
 * Comment ajouter un fichier :
 * 1. Dépose le fichier dans /public/fichiers/{slug}/ (ex: /public/fichiers/excel/s1-tp.xlsx)
 * 2. Ajoute une ligne ci-dessous avec son titre et son chemin public (/fichiers/excel/s1-tp.xlsx)
 * 3. Redéploie le site — aucune autre configuration nécessaire.
 */
export const FICHIERS: Record<string, Record<string, FichierRessource[]>> = {
  excel: {
    "Semaine 1": [
      {
        nom: "Ressources de la séance 1 — Excel",
        url: "/fichiers/excel/semaine-1-ressources.xlsx",
        type: "excel",
      },
    ],
  },
  sql: {},
  r: {},
};

export function getFichiers(slug: string, semaine: string): FichierRessource[] {
  return FICHIERS[slug]?.[semaine] ?? [];
}
