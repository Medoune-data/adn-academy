import { NextRequest, NextResponse } from "next/server";
import { verifyStudentToken, getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { idToken, code } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const decoded = await verifyStudentToken(idToken);

    const db = await getAdminDb();
    const roomRef = db.collection("battle_rooms").doc(String(code || "").toUpperCase());
    const roomSnap = await roomRef.get();
    if (!roomSnap.exists) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }
    const room = roomSnap.data()!;
    if (room.hostUid !== decoded.uid) {
      return NextResponse.json({ error: "Seul l'hôte peut démarrer la partie." }, { status: 403 });
    }
    if (room.status !== "waiting") {
      return NextResponse.json({ error: "La partie a déjà démarré." }, { status: 400 });
    }

    const playersSnap = await roomRef.collection("players").get();
    if (playersSnap.size < 2) {
      return NextResponse.json({ error: "Il faut au moins 2 joueurs pour démarrer." }, { status: 400 });
    }

    await roomRef.update({
      status: "playing",
      startedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Requête invalide ou non autorisée" }, { status: 401 });
  }
}
