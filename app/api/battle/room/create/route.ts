import { NextRequest, NextResponse } from "next/server";
import { verifyStudentToken, getAdminDb } from "@/lib/firebase-admin";
import { generateBattleQuestions } from "@/lib/groq";
import { getFallbackQuestions } from "@/lib/battle-fallback";
import { getFormation } from "@/lib/formations";
import { generateRoomCode } from "@/lib/room-code";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { idToken, formationSlug, difficulty, hostName, questionCount } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const decoded = await verifyStudentToken(idToken);
    const uid = decoded.uid;

    const formation = getFormation(formationSlug);
    if (!formation) {
      return NextResponse.json({ error: "Formation inconnue" }, { status: 400 });
    }

    const count = Math.min(Math.max(Number(questionCount) || 8, 4), 15);

    let questions;
    try {
      questions = await generateBattleQuestions(formation.title, count, difficulty || "Intermédiaire");
      if (questions.length === 0) throw new Error("Aucune question générée");
    } catch (err) {
      console.error("Groq indisponible pour la salle, repli sur le stock local :", err);
      questions = getFallbackQuestions(formationSlug).slice(0, count);
    }

    const db = await getAdminDb();

    // Génère un code unique (nouvelle tentative en cas de collision improbable).
    let code = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateRoomCode();
      const existing = await db.collection("battle_rooms").doc(candidate).get();
      if (!existing.exists) {
        code = candidate;
        break;
      }
    }
    if (!code) {
      return NextResponse.json({ error: "Impossible de générer un code de salle, réessaie." }, { status: 500 });
    }

    const roomRef = db.collection("battle_rooms").doc(code);
    const batch = db.batch();

    batch.set(roomRef, {
      hostUid: uid,
      formationSlug,
      formationTitle: formation.title,
      difficulty: difficulty || "Intermédiaire",
      questionCount: questions.length,
      questionTimeMs: 20000,
      status: "waiting",
      startedAt: null,
      createdAt: new Date().toISOString(),
    });

    questions.forEach((q, i) => {
      batch.set(roomRef.collection("questions_public").doc(String(i)), {
        question: q.question,
        options: q.options,
      });
      batch.set(roomRef.collection("questions_private").doc(String(i)), {
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    });

    batch.set(roomRef.collection("players").doc(uid), {
      name: hostName || "Hôte",
      score: 0,
      answeredCount: 0,
      isHost: true,
      joinedAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({ code });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Requête invalide ou non autorisée" }, { status: 401 });
  }
}
