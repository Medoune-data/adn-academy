import QRCode from "qrcode";
import { planLabel } from "@/lib/membership";

// À ajuster pour coller à la charte du site.
const COLORS = {
  bg: "#0d0f12",
  border: "#2a2f36",
  text: "#f2f2f0",
  dim: "#8b919a",
  accent: "#3ddc97",
};

export interface MemberCardData {
  name: string;
  cardNumber: string;
  cardId: string; // ID du document Firestore, utilisé dans le lien du QR
  plan?: number;
  since: string; // ex. "Novembre 2026"
}

/** Génère la carte en PNG (85,6 × 54 mm à ~300 dpi) et la télécharge.
 *  Aucune date d'expiration n'est imprimée : la validité se vérifie
 *  en scannant le QR code (page /carte/[id]). */
export async function generateMemberCardPNG(data: MemberCardData) {
  const W = 1011;
  const H = 638;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");

  // Fond + cadre
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W - 4, H - 4);
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(0, 0, 14, H);

  // En-tête
  ctx.fillStyle = COLORS.accent;
  ctx.font = "bold 64px Georgia, serif";
  ctx.fillText("ADN", 70, 120);
  ctx.fillStyle = COLORS.dim;
  ctx.font = "28px Arial, sans-serif";
  ctx.fillText("African Data Network", 70, 165);

  // Formule
  ctx.fillStyle = COLORS.text;
  ctx.font = "26px Arial, sans-serif";
  ctx.fillText(planLabel(data.plan).split(" — ")[0], 70, 245);

  // Nom (réduit si trop long)
  ctx.fillStyle = COLORS.text;
  let size = 52;
  const name = data.name.toUpperCase();
  do {
    ctx.font = `bold ${size}px Arial, sans-serif`;
    size -= 2;
  } while (ctx.measureText(name).width > 520 && size > 24);
  ctx.fillText(name, 70, 400);

  // Numéro + date d'adhésion
  ctx.fillStyle = COLORS.accent;
  ctx.font = "bold 36px 'Courier New', monospace";
  ctx.fillText(data.cardNumber, 70, 490);
  ctx.fillStyle = COLORS.dim;
  ctx.font = "24px Arial, sans-serif";
  ctx.fillText(`Membre depuis ${data.since}`, 70, 540);

  // QR code -> page de vérification
  const url = `${window.location.origin}/carte/${data.cardId}`;
  const qr = await QRCode.toDataURL(url, {
    margin: 1,
    width: 300,
    color: { dark: "#0d0f12", light: "#ffffff" },
  });
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("QR illisible"));
    img.src = qr;
  });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(660, 190, 300, 300);
  ctx.drawImage(img, 660, 190, 300, 300);
  ctx.fillStyle = COLORS.dim;
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("Scanner pour vérifier", 700, 530);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `Carte-ADN-${data.cardNumber}.png`;
  a.click();
}
