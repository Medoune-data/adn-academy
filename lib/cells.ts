// Les cellules ADN. Pour en ajouter une : copie un bloc ci-dessous,
// change l'id, le nom, le code et les couleurs. C'est tout.
// Les couleurs doivent être en hexadécimal à 6 chiffres (ex. #4da3ff).
// ⚠️ Ne change jamais l'`id` d'une cellule déjà utilisée (il est stocké
// dans Firestore chez les élèves et sur les cartes).

export interface Cell {
  id: string;
  name: string;
  code: string;      // dans le numéro de carte : ADN-BKE-2026-XXXXX
  accent: string;    // couleur principale de la carte
  accent2: string;   // 2e couleur du dégradé
  bgFrom: string;    // fond de la carte (haut)
  bgTo: string;      // fond de la carte (bas)
  contact: string;   // WhatsApp de la cellule, format international sans "+"
  tagline: string;
}

export const CELLS: Cell[] = [
  {
    id: "bouake",
    name: "Bouaké",
    code: "BKE",
    accent: "#4da3ff",
    accent2: "#7be0d6",
    bgFrom: "#0a1424",
    bgTo: "#12233f",
    contact: "2250564094530", // à remplacer par le numéro de la cellule
    tagline: "Apprendre la data, ensemble.",
  },
];

export function getCell(id?: string): Cell | undefined {
  return CELLS.find((c) => c.id === id);
}

export function formatPhone(intl: string) {
  // 2250564094530 -> +225 05 64 09 45 30
  const m = intl.match(/^(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]} ${m[6]}` : `+${intl}`;
}
