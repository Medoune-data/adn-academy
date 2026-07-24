import { NextRequest, NextResponse } from "next/server";
import { verifyStudentToken, getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { idToken, code } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    await verifyStudentToken(idToken);

    const db = await getAdminDb();
    const roomRef = db.collection("battle_rooms").doc(String(code || "").toUpperCase());
    const roomSnap = await roomRef.get();
    if (!roomSnap.exists) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }
    if (roomSnap.data()?.status === "playing") {
      await roomRef.update({ status: "finished" });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Requête invalide ou non autorisée" }, { status: 401 });
  }
}
