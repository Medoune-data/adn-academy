import { NextRequest, NextResponse } from "next/server";
import { verifyStudentToken, getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { idToken, code, name } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const decoded = await verifyStudentToken(idToken);
    const uid = decoded.uid;

    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!normalizedCode) {
      return NextResponse.json({ error: "Code de salle manquant" }, { status: 400 });
    }

    const db = await getAdminDb();
    const roomRef = db.collection("battle_rooms").doc(normalizedCode);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return NextResponse.json({ error: "Cette salle n'existe pas." }, { status: 404 });
    }
    const room = roomSnap.data()!;
    if (room.status !== "waiting") {
      return NextResponse.json({ error: "Cette partie a déjà commencé ou est terminée." }, { status: 400 });
    }

    const playerRef = roomRef.collection("players").doc(uid);
    const existing = await playerRef.get();
    if (!existing.exists) {
      await playerRef.set({
        name: name || "Joueur",
        score: 0,
        answeredCount: 0,
        isHost: false,
        joinedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ code: normalizedCode });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Requête invalide ou non autorisée" }, { status: 401 });
  }
}
