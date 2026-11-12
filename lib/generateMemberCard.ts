import QRCode from "qrcode";
import type { Cell } from "@/lib/cells";
import { formatPhone } from "@/lib/cells";

export interface MemberCardData {
  name: string;
  cardNumber: string;
  cardId: string; // ID du document Firestore, utilisé dans le lien du QR
  cell: Cell;
  since: string; // ex. "Novembre 2026"
}

const W = 1011; // 85,6 mm à ~300 dpi
const H = 638; // 54 mm
const GAP = 60;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Fond commun : dégradé de la cellule + quadrillage de tableur discret
 *  + bande de couleur en bas. Dessiné dans un cadre arrondi (oy = décalage). */
function drawBase(ctx: CanvasRenderingContext2D, oy: number, cell: Cell) {
  ctx.save();
  rr(ctx, 0, oy, W, H, 36);
  ctx.clip();

  const bg = ctx.createLinearGradient(0, oy, W, oy + H);
  bg.addColorStop(0, cell.bgFrom);
  bg.addColorStop(1, cell.bgTo);
  ctx.fillStyle = bg;
  ctx.fillRect(0, oy, W, H);

  // Quadrillage (clin d'œil aux cellules Excel)
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, oy);
    ctx.lineTo(x, oy + H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 54) {
    ctx.beginPath();
    ctx.moveTo(0, oy + y);
    ctx.lineTo(W, oy + y);
    ctx.stroke();
  }

  // Halo de couleur en haut à droite
  const glow = ctx.createRadialGradient(W - 120, oy + 40, 10, W - 120, oy + 40, 420);
  glow.addColorStop(0, cell.accent + "55");
  glow.addColorStop(1, cell.accent + "00");
  ctx.fillStyle = glow;
  ctx.fillRect(0, oy, W, H);

  // Bande de couleur en bas
  const bar = ctx.createLinearGradient(0, 0, W, 0);
  bar.addColorStop(0, cell.accent);
  bar.addColorStop(1, cell.accent2);
  ctx.fillStyle = bar;
  ctx.fillRect(0, oy + H - 14, W, 14);

  ctx.restore();
}

async function drawFront(ctx: CanvasRenderingContext2D, oy: number, d: MemberCardData) {
  const { cell } = d;
  drawBase(ctx, oy, cell);

  // Logo
  ctx.fillStyle = cell.accent;
  ctx.font = "bold 64px Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText("ADN", 64, oy + 108);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("AFRICAN DATA NETWORK", 66, oy + 142);

  // Pastille de cellule (à droite)
  const label = `CELLULE · ${cell.name.toUpperCase()}`;
  ctx.font = "bold 22px Arial, sans-serif";
  const tw = ctx.measureText(label).width;
  const px = W - 64 - tw - 40;
  rr(ctx, px, oy + 64, tw + 40, 48, 24);
  ctx.fillStyle = cell.accent + "33";
  ctx.fill();
  ctx.strokeStyle = cell.accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = cell.accent;
  ctx.fillText(label, px + 20, oy + 96);

  // Monogramme
  const mg = ctx.createLinearGradient(64, oy + 230, 184, oy + 350);
  mg.addColorStop(0, cell.accent);
  mg.addColorStop(1, cell.accent2);
  ctx.beginPath();
  ctx.arc(124, oy + 300, 60, 0, Math.PI * 2);
  ctx.fillStyle = mg;
  ctx.fill();
  ctx.fillStyle = cell.bgFrom;
  ctx.font = "bold 46px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(initials(d.name), 124, oy + 317);
  ctx.textAlign = "left";

  // Nom (réduit si trop long)
  const name = d.name.toUpperCase();
  let size = 50;
  ctx.fillStyle = "#ffffff";
  do {
    ctx.font = `bold ${size}px Arial, sans-serif`;
    size -= 2;
  } while (ctx.measureText(name).width > 440 && size > 24);
  ctx.fillText(name, 214, oy + 305);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "24px Arial, sans-serif";
  ctx.fillText("Membre", 216, oy + 345);

  // Numéro + date d'adhésion
  ctx.fillStyle = cell.accent2;
  ctx.font = "bold 34px 'Courier New', monospace";
  ctx.fillText(d.cardNumber, 64, oy + 510);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "22px Arial, sans-serif";
  ctx.fillText(`Membre depuis ${d.since}`, 64, oy + 552);

  // QR -> page de vérification
  const url = `${window.location.origin}/carte/${d.cardId}`;
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 400 });
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("QR illisible"));
    img.src = qr;
  });
  rr(ctx, 700, oy + 180, 250, 250, 20);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.drawImage(img, 714, oy + 194, 222, 222);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "20px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scanner pour vérifier", 825, oy + 466);
  ctx.textAlign = "left";
}

function drawBack(ctx: CanvasRenderingContext2D, oy: number, d: MemberCardData) {
  const { cell } = d;
  drawBase(ctx, oy, cell);

  ctx.textAlign = "center";
  ctx.fillStyle = cell.accent;
  ctx.font = "bold 56px Georgia, serif";
  ctx.fillText("ADN", W / 2, oy + 150);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "22px Arial, sans-serif";
  ctx.fillText("AFRICAN DATA NETWORK", W / 2, oy + 188);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px Arial, sans-serif";
  ctx.fillText(`Cellule de ${cell.name}`, W / 2, oy + 280);
  ctx.fillStyle = cell.accent2;
  ctx.font = "italic 28px Georgia, serif";
  ctx.fillText(cell.tagline, W / 2, oy + 326);

  ctx.fillStyle = "#ffffff";
  ctx.font = "26px Arial, sans-serif";
  ctx.fillText(window.location.host, W / 2, oy + 410);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText(`WhatsApp : ${formatPhone(cell.contact)}`, W / 2, oy + 452);

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "18px Arial, sans-serif";
  ctx.fillText(
    "Carte personnelle et non cessible. Pour vérifier la validité, scanner le QR code au recto.",
    W / 2,
    oy + 560
  );
  ctx.textAlign = "left";
}

/** Télécharge une image avec le recto et le verso l'un sous l'autre.
 *  Aucune date d'expiration n'est imprimée : la validité se vérifie au
 *  scan du QR code (page /carte/[id]). */
export async function generateMemberCardPNG(data: MemberCardData) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H * 2 + GAP;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");

  ctx.fillStyle = "#e9ecef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await drawFront(ctx, 0, data);
  drawBack(ctx, H + GAP, data);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `Carte-ADN-${data.cardNumber}.png`;
  a.click();
}
