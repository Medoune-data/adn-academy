import { NextRequest, NextResponse } from "next/server";
import { verifyStudentToken, getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const BASE_XP = 10;
const MAX_SPEED_BONUS = 10;

export async function POST(req: NextRequest) {
  try {
    const { idToken, code, questionIndex, chosenIndex } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const decoded = await verifyStudentToken(idToken);
    const uid = decoded.uid;

    if (typeof questionIndex !== "number") {
      return NextResponse.json({ error: "Index de question invalide" }, { status: 400 });
    }

    const db = await getAdminDb();
    const roomCode = String(code || "").toUpperCase();
    const roomRef = db.collection("battle_rooms").doc(roomCode);
    const roomSnap = await roomRef.get();
    if (!roomSnap.exists) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }
    const room = roomSnap.data()!;

    if (room.status !== "playing" || !room.startedAt) {
      return NextResponse.json({ error: "La partie n'est pas en cours." }, { status: 400 });
    }
    if (questionIndex < 0 || questionIndex >= room.questionCount) {
      return NextResponse.json({ error: "Question hors limites" }, { status: 400 });
    }

    const playerRef = roomRef.collection("players").doc(uid);
    const playerSnap = await playerRef.get();
    if (!playerSnap.exists) {
      return NextResponse.json({ error: "Tu n'as pas rejoint cette salle." }, { status: 403 });
    }

    // Empêche de répondre deux fois à la même question (pas de triche en
    // renvoyant une réponse après avoir vu le résultat une première fois).
    const answerRef = playerRef.collection("answers").doc(String(questionIndex));
    const existingAnswer = await answerRef.get();
    if (existingAnswer.exists) {
      return NextResponse.json({ error: "Question déjà répondue" }, { status: 409 });
    }

    // Le "bon" indice et l'explication ne vivent que côté serveur.
    const privateSnap = await roomRef.collection("questions_private").doc(String(questionIndex)).get();
    if (!privateSnap.exists) {
      return NextResponse.json({ error: "Question introuvable" }, { status: 404 });
    }
    const { correctIndex, explanation } = privateSnap.data()!;

    // Temps de réponse mesuré par le serveur, jamais déclaré par le client :
    // le calendrier des questions est déterministe (startedAt + index * durée),
    // donc le serveur sait exactement quand cette question a dû apparaître.
    const questionTimeMs = room.questionTimeMs || 20000;
    const expectedStart = new Date(room.startedAt).getTime() + questionIndex * questionTimeMs;
    const now = Date.now();

    // Marge de 3s pour la latence réseau normale — au-delà, on considère
    // que le créneau de cette question est définitivement clos.
    if (now - expectedStart > questionTimeMs + 3000) {
      return NextResponse.json({ error: "Temps écoulé pour cette question" }, { status: 400 });
    }

    const elapsed = Math.min(Math.max(now - expectedStart, 0), questionTimeMs);

    const correct = typeof chosenIndex === "number" && chosenIndex === correctIndex;
    let xpGained = 0;
    if (correct) {
      const speedRatio = Math.max(0, 1 - elapsed / questionTimeMs);
      xpGained = BASE_XP + Math.round(speedRatio * MAX_SPEED_BONUS);
    }

    await answerRef.set({
      chosenIndex: typeof chosenIndex === "number" ? chosenIndex : null,
      correct,
      xpGained,
      answeredAt: new Date().toISOString(),
    });

    await playerRef.update({
      score: (playerSnap.data()?.score || 0) + xpGained,
      answeredCount: (playerSnap.data()?.answeredCount || 0) + 1,
    });

    return NextResponse.json({ correct, correctIndex, explanation, xpGained });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Requête invalide ou non autorisée" }, { status: 401 });
  }
}
