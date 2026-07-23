"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCourseConfig } from "@/lib/generateCertificate";

interface Certificate {
  studentName: string;
  courseTitle: string;
  issueDate: string;
  duration?: string;
  level?: string;
  mention?: "Excellence" | "Très Bien" | "Bien" | "Passable";
  projectDescription?: string;
  projectUrl?: string;
}

const MENTION_STYLE: Record<string, string> = {
  Excellence: "text-amber border-amber/40 bg-amber-dim",
  "Très Bien": "text-accent border-accent/40 bg-accent-dim",
  Bien: "text-text border-border-strong bg-surface",
  Passable: "text-text-dim border-border bg-surface",
};

export default function VerifyCertificatePage() {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const snap = await getDoc(doc(db, "certificates", id));
        if (snap.exists()) setCert(snap.data() as Certificate);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 border border-border-strong border-t-accent rounded-full animate-spin" />
        <p className="text-text-faint font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Vérification de l&apos;authenticité...
        </p>
      </main>
    );
  }

  if (!cert) {
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen">
        <div className="max-w-lg mx-auto text-center border border-red-500/20 bg-red-500/5 rounded-2xl p-14">
          <span className="text-5xl mb-6 block">⚠️</span>
          <h1 className="font-display italic text-2xl text-text mb-4">Certificat introuvable</h1>
          <p className="text-text-dim text-sm font-light">
            Cet identifiant ne correspond à aucun certificat enregistré.
          </p>
          <Link href="/" className="inline-block mt-8 text-[10px] font-mono uppercase tracking-widest text-accent hover:underline">
            Retour à l&apos;accueil →
          </Link>
        </div>
      </main>
    );
  }

  const mentionClass = cert.mention ? MENTION_STYLE[cert.mention] : "";
  const skills = cert ? getCourseConfig(cert.courseTitle).skills : [];

  return (
    <main className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative border border-accent/30 bg-surface/60 rounded-2xl overflow-hidden">
          <div className="p-10 md:p-14 text-center">
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] font-bold text-accent">
                Certificat authentifié
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>

            <p className="text-text-dim text-sm font-light mb-3">
              Ce document atteste que l&apos;étudiant(e)
            </p>
            <h1 className="font-display text-3xl md:text-5xl text-text mb-4 uppercase tracking-tight">
              {cert.studentName}
            </h1>
            <p className="text-text-dim text-sm font-light mb-5">
              a complété avec succès le programme
            </p>
            <span className="inline-block px-6 py-2.5 rounded-full border border-accent/40 bg-accent-dim text-accent text-sm font-bold tracking-wide">
              {cert.courseTitle}
            </span>

            <div className="flex flex-wrap items-center justify-center gap-5 text-[10px] font-mono uppercase tracking-widest text-text-faint mt-8">
              <span>Délivré le {cert.issueDate}</span>
              {cert.duration && <span>· {cert.duration}</span>}
              {cert.level && <span>· {cert.level}</span>}
            </div>

            {cert.mention && (
              <div className={`inline-flex items-center gap-2 mt-6 px-5 py-2 rounded-full border ${mentionClass}`}>
                <span>🏅</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">Mention {cert.mention}</span>
              </div>
            )}
          </div>
        </div>

        {(skills.length > 0 || cert.projectDescription || cert.projectUrl) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.length > 0 && (
              <div className="border border-border bg-surface rounded-2xl p-8">
                <p className="cell-label mb-6">Compétences validées</p>
                <ul className="space-y-3">
                  {skills.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-text-dim text-sm font-light">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-6">
              {cert.projectDescription && (
                <div className="border border-border bg-surface/40 rounded-2xl p-8 flex-1">
                  <p className="cell-label mb-4">Projet final</p>
                  <p className="text-text-dim text-sm font-light leading-relaxed">{cert.projectDescription}</p>
                </div>
              )}
              {cert.projectUrl && (
                <a
                  href={cert.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-accent/30 bg-accent-dim rounded-2xl p-8 flex items-center justify-center text-accent text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  Consulter le projet →
                </a>
              )}
            </div>
          </div>
        )}

        <div className="border border-border bg-surface/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint mb-1">
              ID de vérification
            </p>
            <p className="text-xs font-mono text-text-dim break-all">{id}</p>
          </div>
          <button
            onClick={handleCopy}
            className="text-[10px] font-mono uppercase tracking-widest border border-border-strong px-5 py-2.5 rounded-lg hover:border-accent/50 transition-colors text-text-dim hover:text-text"
          >
            {copied ? "✓ Lien copié" : "Copier le lien"}
          </button>
        </div>
      </div>
    </main>
  );
}
