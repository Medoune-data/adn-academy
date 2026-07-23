import { BattleQuestion } from "./groq";

export const FALLBACK_QUESTIONS: Record<string, BattleQuestion[]> = {
  excel: [
    {
      question: "Quelle fonction Excel permet de compter les cellules non vides ?",
      options: ["SOMME", "NBVAL", "MOYENNE", "NB.SI"],
      correctIndex: 1,
      explanation: "NBVAL compte toutes les cellules non vides d'une plage, quel que soit leur contenu.",
    },
    {
      question: "Quelle formule recherche une valeur dans une colonne et renvoie une valeur associée ?",
      options: ["SOMME.SI", "RECHERCHEV", "CONCATENER", "NB.SI"],
      correctIndex: 1,
      explanation: "RECHERCHEV (VLOOKUP) cherche une valeur dans la première colonne d'une plage et renvoie une valeur correspondante.",
    },
    {
      question: "Comment fige-t-on une référence de cellule dans une formule (ex: A1) ?",
      options: ["Avec des guillemets", "Avec le symbole $ (ex: $A$1)", "Avec des parenthèses", "Ce n'est pas possible"],
      correctIndex: 1,
      explanation: "Le symbole $ crée une référence absolue qui ne change pas quand on recopie la formule.",
    },
    {
      question: "Quel outil permet de résumer rapidement de grandes quantités de données ?",
      options: ["Mise en forme conditionnelle", "Tableau croisé dynamique", "Validation de données", "Filtre automatique"],
      correctIndex: 1,
      explanation: "Le tableau croisé dynamique agrège et résume rapidement de grands volumes de données.",
    },
    {
      question: "Quelle fonction compte les cellules répondant à une condition ?",
      options: ["NB.SI", "SOMME", "MOYENNE", "NBVAL"],
      correctIndex: 0,
      explanation: "NB.SI compte le nombre de cellules qui remplissent un critère donné.",
    },
  ],
  sql: [
    {
      question: "Quelle requête SQL permet de sélectionner toutes les colonnes d'une table ?",
      options: ["SELECT ALL FROM table", "SELECT * FROM table", "GET * FROM table", "SELECT COLUMNS FROM table"],
      correctIndex: 1,
      explanation: "L'astérisque (*) après SELECT signifie « toutes les colonnes ».",
    },
    {
      question: "Quelle clause permet de filtrer des lignes selon une condition ?",
      options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
      correctIndex: 2,
      explanation: "WHERE filtre les lignes avant tout regroupement, selon une condition donnée.",
    },
    {
      question: "Quelle instruction combine des lignes de deux tables selon une colonne commune ?",
      options: ["MERGE", "JOIN", "UNION", "LINK"],
      correctIndex: 1,
      explanation: "JOIN (INNER JOIN, LEFT JOIN, etc.) combine des lignes de plusieurs tables selon une clé commune.",
    },
    {
      question: "Quelle clause filtre les résultats après un GROUP BY ?",
      options: ["WHERE", "HAVING", "FILTER", "ON"],
      correctIndex: 1,
      explanation: "HAVING filtre les groupes résultants d'un GROUP BY, contrairement à WHERE qui filtre avant l'agrégation.",
    },
    {
      question: "Quelle fonction retourne le nombre de lignes d'un résultat ?",
      options: ["SUM()", "COUNT()", "TOTAL()", "LEN()"],
      correctIndex: 1,
      explanation: "COUNT() retourne le nombre de lignes correspondant à la requête.",
    },
  ],
  r: [
    {
      question: "Quelle fonction R affiche la structure d'un data frame ?",
      options: ["head()", "str()", "summary()", "dim()"],
      correctIndex: 1,
      explanation: "str() affiche la structure interne d'un objet : types de colonnes, dimensions, aperçu des valeurs.",
    },
    {
      question: "Quel package est le plus utilisé pour la manipulation de données en R ?",
      options: ["ggplot2", "dplyr", "shiny", "caret"],
      correctIndex: 1,
      explanation: "dplyr fournit les verbes principaux de manipulation de données : filter, select, mutate, summarise...",
    },
    {
      question: "Quelle fonction crée un graphique avec ggplot2 ?",
      options: ["plot()", "ggplot()", "chart()", "draw()"],
      correctIndex: 1,
      explanation: "ggplot() initialise un graphique auquel on ajoute des couches (geom_point, geom_bar, etc.).",
    },
    {
      question: "Quel opérateur R permet de chaîner plusieurs opérations (pipe) ?",
      options: ["%>% ou |>", "->", "::", "<-"],
      correctIndex: 0,
      explanation: "Le pipe (%>% du package magrittr, ou |> natif depuis R 4.1) chaîne les opérations de façon lisible.",
    },
    {
      question: "Quelle fonction ajuste un modèle de régression linéaire ?",
      options: ["glm()", "lm()", "predict()", "cor()"],
      correctIndex: 1,
      explanation: "lm() (linear model) ajuste un modèle de régression linéaire classique.",
    },
  ],
};

export function getFallbackQuestions(slug: string) {
  return FALLBACK_QUESTIONS[slug] ?? FALLBACK_QUESTIONS.excel;
}
