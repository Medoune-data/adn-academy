const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export interface BattleQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Demande à Groq un lot de questions QCM pour une formation/niveau donné,
 * en un seul appel (voir lib/firebase-admin.ts et les routes /api/battle/*
 * pour le pourquoi : un appel par partie, pas un appel par question).
 */
export async function generateBattleQuestions(
  formationTitle: string,
  count: number,
  difficulty: string
): Promise<BattleQuestion[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY manquant dans .env.local");
  }

  const prompt = `Tu es un générateur de questions pour un jeu-quiz pédagogique appelé "ADN Battle", destiné à des étudiants africains francophones qui apprennent la data.

Génère exactement ${count} questions à choix multiples sur la formation "${formationTitle}", de niveau "${difficulty}".

Règles :
- Chaque question doit être courte, claire, et avoir 4 options de réponse.
- Une seule bonne réponse par question (index 0 à 3).
- Ajoute une explication courte (1-2 phrases) de la bonne réponse, utile pédagogiquement.
- Varie les sujets à l'intérieur de la formation (ne répète pas la même notion).
- Réponds UNIQUEMENT avec un JSON valide, sans texte avant/après, sans balises markdown, au format exact suivant :

{"questions":[{"question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"..."}]}`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq API erreur ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Réponse Groq vide");

  const parsed = JSON.parse(content);
  const questions = parsed?.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Format de questions invalide reçu de Groq");
  }

  // Validation minimale de chaque question — on ignore silencieusement
  // toute question malformée plutôt que de faire planter la partie.
  return questions.filter(
    (q): q is BattleQuestion =>
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctIndex === "number" &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3 &&
      typeof q.explanation === "string"
  );
}
