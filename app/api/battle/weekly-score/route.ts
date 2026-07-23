import { NextRequest, NextResponse } from "next/server";
import { verifyStudentToken, getAdminDb } from "@/lib/firebase-admin";
import { getCurrentWeekId } from "@/lib/week";

export async function POST(req: NextRequest) {
  try {
    const { idToken, score, timeMs, studentName } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const decoded = await verifyStudentToken(idToken);
    const uid = decoded.uid;

    const weekId = getCurrentWeekId();
    const db = getAdminDb();
    const weeklyDoc = await db.collection("battle_weekly").doc(weekId).get();
    if (!weeklyDoc.exists) {
      return NextResponse.json({ error: "Aucun défi actif cette semaine" }, { status: 400 });
    }
    const totalQuestions = (weeklyDoc.data()?.questions ?? []).length;
    const maxPlausibleScore = totalQuestions * 20; // 10 base + 10 bonus vitesse max par question

    if (
      typeof score !== "number" ||
      score < 0 ||
      score > maxPlausibleScore ||
      typeof timeMs !== "number" ||
      timeMs < 0
    ) {
      return NextResponse.json({ error: "Score invalide" }, { status: 400 });
    }

    const entryRef = db
      .collection("battle_weekly_scores")
      .doc(weekId)
      .collection("entries")
      .doc(uid);

    const existing = await entryRef.get();
    // Un seul essai compte par semaine : on garde le meilleur score.
    if (existing.exists && (existing.data()?.score ?? 0) >= score) {
      return NextResponse.json({ ok: true, kept: "previous" });
    }

    await entryRef.set({
      studentName: studentName || "Élève ADN",
      score,
      timeMs,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, kept: "new" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Requête invalide ou non autorisée" }, { status: 401 });
  }
}
