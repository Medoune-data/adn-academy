export interface Formation {
  slug: string;
  cellRef: string;
  title: string;
  tagline: string;
  description: string;
  price: string;
  duration: string;
  level: string;
  skills: string[];
  accent: "accent" | "amber";
  whatsappMessage: string;
}

export const FORMATIONS: Formation[] = [
  {
    slug: "excel",
    cellRef: "A1",
    title: "Excel pour l'Analyse de Données",
    tagline: "Des données brutes à des décisions claires.",
    description:
      "Maîtrisez les tableaux croisés dynamiques, les formules avancées et les dashboards interactifs pour transformer n'importe quel fichier Excel en outil de pilotage.",
    price: "35 000 FCFA",
    duration: "4 semaines",
    level: "Débutant → Intermédiaire",
    skills: [
      "Tableaux croisés dynamiques",
      "Formules avancées (INDEX/EQUIV, OFFSET)",
      "Dashboards interactifs",
      "Nettoyage & structuration de fichiers",
      "Visualisation de données",
    ],
    accent: "accent",
    whatsappMessage: "Bonjour ADN Academy, je souhaite m'inscrire à la formation Excel.",
  },
  {
    slug: "sql",
    cellRef: "B1",
    title: "Maîtrise de SQL pour le Business",
    tagline: "Interrogez vos bases comme un analyste senior.",
    description:
      "Requêtes complexes, jointures, fonctions de fenêtrage et optimisation : apprenez à extraire et transformer la donnée directement à la source, sur PostgreSQL.",
    price: "45 000 FCFA",
    duration: "5 semaines",
    level: "Intermédiaire",
    skills: [
      "Requêtes complexes (JOIN, CTE, sous-requêtes)",
      "Agrégations & fenêtrage (WINDOW FUNCTIONS)",
      "Optimisation de requêtes",
      "Gestion de bases relationnelles",
      "Analyse métier via SQL",
    ],
    accent: "accent",
    whatsappMessage: "Bonjour ADN Academy, je souhaite m'inscrire à la formation SQL.",
  },
  {
    slug: "r",
    cellRef: "C1",
    title: "Data Science & Stratégie avec R",
    tagline: "De la régression à la décision stratégique.",
    description:
      "Modélisation économétrique, visualisation avancée avec ggplot2 et segmentation de données : le programme le plus poussé d'ADN Academy.",
    price: "60 000 FCFA",
    duration: "6 semaines",
    level: "Avancé",
    skills: [
      "Modélisation économétrique",
      "Analyse de régression (OLS, Logit)",
      "Visualisation avancée (ggplot2)",
      "Nettoyage de données (dplyr / tidyr)",
      "Segmentation & clustering",
    ],
    accent: "amber",
    whatsappMessage: "Bonjour ADN Academy, je souhaite m'inscrire à la formation R.",
  },
];

export function getFormation(slug: string) {
  return FORMATIONS.find((f) => f.slug === slug);
}
