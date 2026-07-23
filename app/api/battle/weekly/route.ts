import { NextRequest, NextResponse } from "next/server";
import { verifyStudentToken, getAdminDb } from "@/lib/firebase-admin";
import { generateBattleQuestions } from "@/lib/groq";
import { getFallbackQuestions } from "@/lib/battle-fallback";
import { getCurrentWeekId } from "@/lib/week";

// firebase-admin nécessite le runtime Node.js (pas Edge).
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const idToken = authHeader.replace(/^Bearer\s+/i, "");
    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    await verifyStudentToken(idToken);

    const weekId = getCurrentWeekId();
    const db = await getAdminDb();
    const ref = db.collection("battle_weekly").doc(weekId);
    const snap = await ref.get();

    if (snap.exists) {
      return NextResponse.json({ weekId, ...snap.data() });
    }

    // Personne n'a encore ouvert le défi cette semaine — on le génère
    // maintenant, une seule fois pour tout le monde.
    let questions;
    let source: "ai" | "fallback" = "ai";
    try {
      questions = await generateBattleQuestions(
        "Excel, SQL et R — mélange de culture générale data",
        12,
        "Mixte"
      );
      if (questions.length === 0) throw new Error("Aucune question générée");
    } catch (err) {
      console.error("Groq indisponible pour le défi hebdo, repli sur le stock local :", err);
      source = "fallback";
      questions = [
        ...getFallbackQuestions("excel").slice(0, 4),
        ...getFallbackQuestions("sql").slice(0, 4),
        ...getFallbackQuestions("r").slice(0, 4),
      ];
    }

    const payload = {
      questions,
      source,
      generatedAt: new Date().toISOString(),
    };
    await ref.set(payload);

    return NextResponse.json({ weekId, ...payload });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Requête invalide ou non autorisée" }, { status: 401 });
  }
}
