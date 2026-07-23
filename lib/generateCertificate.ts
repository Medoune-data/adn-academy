import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface CertificateData {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  duration?: string;
  level?: string;
  mention?: string;
  projectDescription?: string;
  projectUrl?: string;
}

const COURSE_CONFIG_LIST = [
  {
    pattern: /excel/i,
    accent: [31, 122, 108] as [number, number, number], // teal ADN
    shortName: "EXCEL PRO",
    label: "Data Analysis - Office",
    description:
      "Les participants ayant complété ce programme ont développé des compétences pratiques " +
      "pour nettoyer, analyser et visualiser des données avec Excel. Ils maîtrisent la création " +
      "de dashboards interactifs, les formules avancées (INDEX/EQUIV, DATEVAL, NOMPROPRE) " +
      "et l'automatisation des rapports pour la prise de décision stratégique en entreprise. " +
      "Ce programme prépare les apprenants à produire des analyses fiables et exploitables.",
    skills: [
      "Tableaux croisés dynamiques",
      "Dashboards interactifs",
      "Formules avancées (INDEX/EQUIV, OFFSET)",
      "Transformation de données",
      "Visualisation & nettoyage de fichiers",
    ],
  },
  {
    pattern: /sql/i,
    accent: [217, 98, 43] as [number, number, number], // terracotta ADN
    shortName: "SQL MASTER",
    label: "Data Analysis - Database",
    description:
      "Les participants ayant complété ce programme maîtrisent l'interrogation et la manipulation " +
      "de bases de données relationnelles avec SQL. Ils sont compétents dans l'écriture de requêtes " +
      "complexes (JOIN, CTE, Window Functions), l'optimisation des performances et l'extraction " +
      "de données pour l'analyse métier. Ce programme forme des profils capables d'exploiter " +
      "des bases de données réelles dans un contexte professionnel.",
    skills: [
      "Requêtes complexes (JOIN, CTE, Subqueries)",
      "Window Functions (RANK, LAG, ROW_NUMBER)",
      "Optimisation de requêtes & index",
      "Gestion de bases de données relationnelles",
      "Extraction & transformation de données",
    ],
  },
  {
    pattern: /\br\b|rstudio|strateg/i,
    accent: [201, 147, 46] as [number, number, number], // or ADN
    shortName: "R STRATEGY",
    label: "Data Science - Strategy",
    description:
      "Les participants ayant complété ce programme ont acquis des compétences avancées en " +
      "modélisation économétrique et en analyse prédictive avec R. Ils savent préparer, analyser " +
      "et visualiser des données complexes (dplyr, ggplot2) pour orienter la stratégie de revenus. " +
      "Ce programme forme des analystes capables de produire des modèles de régression, " +
      "de segmentation et de prédiction pour la prise de décision stratégique.",
    skills: [
      "Modélisation économétrique",
      "Analyse de régression (OLS, Logit)",
      "Visualisation avancée (ggplot2)",
      "Nettoyage de données (dplyr / tidyr)",
      "Segmentation & clustering",
    ],
  },
];

export function getCourseConfig(courseTitle: string) {
  return COURSE_CONFIG_LIST.find((c) => c.pattern.test(courseTitle)) ?? COURSE_CONFIG_LIST[0];
}

const MENTION_CONFIG: Record<string, { label: string; r: number; g: number; b: number }> = {
  Excellence: { label: "MENTION EXCELLENCE", r: 201, g: 147, b: 46 },
  "Très Bien": { label: "MENTION TRÈS BIEN", r: 31, g: 122, b: 108 },
  Bien: { label: "MENTION BIEN", r: 217, g: 98, b: 43 },
  Passable: { label: "MENTION PASSABLE", r: 110, g: 98, b: 85 },
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
    setTimeout(() => resolve(null), 2000);
  });
}

export async function generateCertificatePDF(cert: CertificateData): Promise<void> {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;
  const cfg = getCourseConfig(cert.courseTitle);
  const [ar, ag, ab] = cfg.accent;
  const mention = cert.mention ? MENTION_CONFIG[cert.mention] ?? MENTION_CONFIG["Bien"] : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adn-community.vercel.app";

  // Fond
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, "F");

  // Bordures
  doc.setDrawColor(ar, ag, ab);
  doc.setLineWidth(2);
  doc.rect(6, 6, W - 12, H - 12);
  doc.setLineWidth(0.35);
  doc.setGState(doc.GState({ opacity: 0.2 }));
  doc.rect(10, 10, W - 20, H - 20);
  doc.setGState(doc.GState({ opacity: 1 }));

  // Header
  doc.setFillColor(ar, ag, ab);
  doc.rect(6, 6, W - 12, 26, "F");

  const logo = await loadImage("/logo-adn.png");
  if (logo) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 8, 34, 20, 2, 2, "F");
    doc.addImage(logo, "PNG", 12, 8, 34, 20);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("ADN COMMUNITY", 14, 21);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICAT DE FORMATION PROFESSIONNELLE", W / 2, 18, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setGState(doc.GState({ opacity: 0.85 }));
  doc.text(cfg.label, W / 2, 25, { align: "center" });
  doc.setGState(doc.GState({ opacity: 1 }));

  const divX = 196;
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(divX, 36, divX, H - 18);

  const lx = 16;
  let y = 42;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(160, 160, 160);
  doc.text("CE DOCUMENT OFFICIEL ATTESTE QUE", lx, y);
  y += 12;

  const nameStr = cert.studentName.toUpperCase();
  doc.setFont("times", "bold");
  let fs = 30;
  doc.setFontSize(fs);
  while (doc.getTextWidth(nameStr) > divX - lx - 8 && fs > 16) {
    fs -= 1;
    doc.setFontSize(fs);
  }
  doc.setTextColor(15, 15, 15);
  doc.text(nameStr, lx, y);
  y += 3;

  const nw = Math.min(doc.getTextWidth(nameStr), divX - lx - 8);
  doc.setDrawColor(ar, ag, ab);
  doc.setLineWidth(1.5);
  doc.line(lx, y, lx + nw, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text("a complété avec succès le programme de formation", lx, y);
  y += 8;

  const boxH = 11;
  doc.setFillColor(ar, ag, ab);
  doc.setGState(doc.GState({ opacity: 0.07 }));
  doc.roundedRect(lx - 2, y - 3, divX - lx - 10, boxH, 2, 2, "F");
  doc.setGState(doc.GState({ opacity: 1 }));
  doc.setDrawColor(ar, ag, ab);
  doc.setLineWidth(2.5);
  doc.line(lx - 2, y - 3, lx - 2, y + boxH - 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ar, ag, ab);
  doc.text(cert.courseTitle, lx + 4, y + 4.5);
  y += boxH + 4;

  const metaItems: { label: string; value: string }[] = [];
  if (cert.issueDate) metaItems.push({ label: "Date :", value: cert.issueDate });
  if (cert.duration) metaItems.push({ label: "Durée :", value: cert.duration });
  if (cert.level) metaItems.push({ label: "Niveau :", value: cert.level });

  let mx2 = lx;
  metaItems.forEach((m, i) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text(m.label, mx2, y);
    const lw = doc.getTextWidth(m.label);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text(m.value, mx2 + lw + 1.5, y);
    const vw = doc.getTextWidth(m.value);
    mx2 += lw + vw + 1.5 + 12;
    if (i < metaItems.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(mx2 - 6, y - 3, mx2 - 6, y + 1);
    }
  });
  y += 8;

  if (mention) {
    const mw = 60;
    doc.setFillColor(mention.r, mention.g, mention.b);
    doc.setGState(doc.GState({ opacity: 0.1 }));
    doc.roundedRect(lx - 2, y - 3.5, mw, 8, 4, 4, "F");
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setFillColor(mention.r, mention.g, mention.b);
    doc.rect(lx + 1, y - 2, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(mention.r, mention.g, mention.b);
    doc.text(mention.label, lx + 7, y + 1);
    y += 10;
  } else {
    y += 4;
  }

  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.3);
  doc.line(lx, y, divX - 10, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(ar, ag, ab);
  doc.text("À PROPOS DE CETTE FORMATION", lx, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);
  const descLines = doc.splitTextToSize(cfg.description, divX - lx - 12);
  descLines.forEach((line: string) => {
    doc.text(line, lx, y);
    y += 5.5;
  });
  y += 3;

  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.3);
  doc.line(lx, y, divX - 10, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(ar, ag, ab);
  doc.text("COMPÉTENCES VALIDÉES", lx, y);
  y += 5;

  const colW = (divX - lx - 12) / 2;
  const half = Math.ceil(cfg.skills.length / 2);
  cfg.skills.forEach((skill, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    const sx = lx + col * colW;
    const sy = y + row * 6;
    doc.setFillColor(ar, ag, ab);
    doc.circle(sx + 1.2, sy - 1.2, 1, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(40, 40, 40);
    doc.text(skill, sx + 5, sy - 0.2);
  });
  y += Math.ceil(cfg.skills.length / 2) * 6 + 3;

  if (cert.projectDescription && cert.projectDescription.trim().length > 0) {
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.3);
    doc.line(lx, y, divX - 10, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(ar, ag, ab);
    doc.text("PROJET FINAL", lx, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    const projLines = doc.splitTextToSize(cert.projectDescription, divX - lx - 12);
    projLines.slice(0, 4).forEach((line: string) => {
      doc.text(line, lx, y);
      y += 5;
    });
  }

  // Colonne droite : QR + signature
  const rx = divX + 8;
  const rw = W - divX - 14;
  let ry = 40;

  const qrSize = Math.min(rw - 10, 54);
  const qrX = rx + (rw - qrSize) / 2;
  const verifyUrl = `${siteUrl}/verify/${cert.id}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 500,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.4);
    doc.roundedRect(qrX - 2, ry - 2, qrSize + 4, qrSize + 4, 2, 2, "FD");
    doc.addImage(qrDataUrl, "PNG", qrX, ry, qrSize, qrSize);
  } catch (e) {
    console.error("QR:", e);
  }

  ry += qrSize + 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(130, 130, 130);
  doc.text("Scannez pour vérifier", rx + rw / 2, ry, { align: "center" });
  ry += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(ar, ag, ab);
  doc.text("ADN Academy", rx + rw / 2, ry, { align: "center" });

  const sigBottomY = H - 20;
  const sigBlockH = 36;
  const sigStartY = sigBottomY - sigBlockH;

  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.3);
  doc.line(rx, sigStartY, rx + rw, sigStartY);

  const sigImg = await loadImage("/signature.png");
  if (sigImg) {
    doc.addImage(sigImg, "PNG", rx + rw / 2 - 20, sigStartY + 3, 40, 16);
  } else {
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.setGState(doc.GState({ opacity: 0.25 }));
    doc.text("ADN Academy", rx + rw / 2, sigStartY + 13, { align: "center" });
    doc.setGState(doc.GState({ opacity: 1 }));
  }

  doc.setDrawColor(ar, ag, ab);
  doc.setLineWidth(0.6);
  doc.line(rx + 8, sigStartY + 21, rx + rw - 8, sigStartY + 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(20, 20, 20);
  doc.text("ADN Academy", rx + rw / 2, sigStartY + 26, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(110, 110, 110);
  doc.text("École de formation data", rx + rw / 2, sigStartY + 31, { align: "center" });
  doc.text("ADN Community", rx + rw / 2, sigStartY + 36, { align: "center" });

  // Footer
  doc.setFillColor(248, 249, 250);
  doc.rect(6, H - 16, W - 12, 10, "F");
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(16, H - 16, W - 16, H - 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(150, 150, 150);
  doc.text(`ID : ${cert.id}`, 16, H - 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(ar, ag, ab);
  doc.text(`Vérification : ${verifyUrl.replace(/^https?:\/\//, "")}`, W / 2, H - 10, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(150, 150, 150);
  doc.text(`© ${new Date().getFullYear()} ADN Academy - Côte d'Ivoire`, W - 16, H - 10, { align: "right" });

  const safeName = cert.studentName.replace(/\s+/g, "_").toLowerCase();
  const safeCourse = cfg.shortName.replace(/\s+/g, "_").toLowerCase();
  doc.save(`certificat_${safeName}_${safeCourse}.pdf`);
}
