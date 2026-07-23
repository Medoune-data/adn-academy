import { NextRequest, NextResponse } from "next/server";
import { verifyStudentToken } from "@/lib/firebase-admin";
import { generateBattleQuestions } from "@/lib/groq";
import { getFallbackQuestions } from "@/lib/battle-fallback";
import { getFormation } from "@/lib/formations";

export async function POST(req: NextRequest) {
  try {
    const { idToken, formationSlug, difficulty } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    await verifyStudentToken(idToken); // lève une erreur si le token est invalide

    const formation = getFormation(formationSlug);
    if (!formation) {
      return NextResponse.json({ error: "Formation inconnue" }, { status: 400 });
    }

    try {
      const questions = await generateBattleQuestions(
        formation.title,
        10,
        difficulty || "Intermédiaire"
      );
      if (questions.length === 0) throw new Error("Aucune question générée");
      return NextResponse.json({ questions, source: "ai" });
    } catch (err) {
      console.error("Groq indisponible, repli sur le stock local :", err);
      return NextResponse.json({
        questions: getFallbackQuestions(formationSlug),
        source: "fallback",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Requête invalide ou non autorisée" }, { status: 401 });
  }
}
