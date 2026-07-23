"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { getFormation } from "@/lib/formations";
import { getFichiers } from "@/lib/fichiers";

interface Seance {
  id: string;
  semaine: string;
  titre: string;
  description: string;
  youtubeId?: string;
  date: string;
}

const FILE_ICON: Record<string, string> = {
  excel: "📊",
  pdf: "📄",
  sql: "🗄️",
  r: "📈",
};

function RessourcesHub() {
  const { profile } = useAuth();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const formation = getFormation(slug);

  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);

  const isEnrolled = !!profile?.enrolledFormations?.includes(slug);

  useEffect(() => {
    if (!isEnrolled) {
      setLoading(false);
      return;
    }
    const fetchSeances = async () => {
      try {
        const q = query(collection(db, "formations", slug, "seances"), orderBy("date", "asc"));
        const snap = await getDocs(q);
        setSeances(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Seance)));
      } catch {
        setSeances([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSeances();
  }, [slug, isEnrolled]);

  if (!formation) {
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen text-center">
        <p className="text-text-dim">Formation introuvable.</p>
      </main>
    );
  }

  if (!isEnrolled) {
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen">
        <div className="max-w-2xl mx-auto text-center border border-border rounded-2xl p-12 bg-surface/40">
          <h1 className="font-display italic text-2xl md:text-3xl text-text mb-4">
            Accès réservé
          </h1>
          <p className="text-text-dim font-light leading-relaxed mb-8">
            L&apos;espace ressources de « {formation.title} » est réservé aux élèves
            inscrits à cette formation. Si tu as déjà payé, contacte l&apos;équipe
            pour activer ton accès.
          </p>
          <a
            href={`https://wa.me/2250564094530?text=${encodeURIComponent(
              `Bonjour, je souhaite activer mon accès à la formation ${formation.title}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-6 py-3.5 rounded-md hover:brightness-110 transition-all"
          >
            Activer mon accès →
          </a>
        </div>
      </main>
    );
  }

  const derniere = seances[seances.length - 1];

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14 border-b border-border pb-8 gap-4">
          <div>
            <span className="font-mono text-[10px] text-text-faint">{formation.cellRef}</span>
            <h1 className="font-display italic text-3xl md:text-4xl text-text mt-2">
              {formation.title}
            </h1>
            <p className="text-text-dim text-sm font-light mt-2">Espace ressources — élève</p>
          </div>
          <Link
            href="/espace-eleve"
            className="text-[10px] uppercase tracking-widest text-text-dim hover:text-text border border-border rounded-md px-4 py-2 transition-colors"
          >
            ← Retour
          </Link>
        </div>

        {loading ? (
          <p className="text-text-faint font-mono text-xs uppercase tracking-widest animate-pulse">
            Chargement des séances...
          </p>
        ) : seances.length === 0 ? (
          <div className="border border-border rounded-2xl p-10 bg-surface/40 text-center">
            <p className="text-text-dim font-light">
              Aucune séance publiée pour l&apos;instant. Reviens juste avant le
              prochain cours.
            </p>
          </div>
        ) : (
          <>
            {derniere?.youtubeId && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-accent text-bg text-[10px] font-bold px-2 py-1 rounded font-mono uppercase tracking-wider">
                    Dernier replay
                  </span>
                  <h2 className="font-display italic text-xl text-text">
                    {derniere.semaine} — {derniere.titre}
                  </h2>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${derniere.youtubeId}`}
                    title="Rediffusion"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            <section>
              <p className="cell-label mb-8">Archives des séances & fichiers</p>
              <div className="space-y-8">
                {[...seances].reverse().map((s) => {
                  const fichiers = getFichiers(slug, s.semaine);
                  return (
                    <div
                      key={s.id}
                      className="border border-border rounded-2xl p-8 bg-surface hover:border-accent/30 transition-all"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                        {s.semaine} · {s.date}
                      </span>
                      <h3 className="font-display italic text-lg text-text mt-2 mb-2">{s.titre}</h3>
                      <p className="text-text-dim text-sm font-light mb-6">{s.description}</p>

                      {fichiers.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fichiers.map((f, i) => (
                            <a
                              key={i}
                              href={f.url}
                              download
                              className="flex items-center justify-between p-4 bg-bg border border-border rounded-lg hover:border-accent/50 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <span>{FILE_ICON[f.type] ?? "📄"}</span>
                                <span className="text-sm text-text-dim group-hover:text-text">{f.nom}</span>
                              </div>
                              <span className="text-text-faint group-hover:text-accent text-xs">↓</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default function RessourcesPage() {
  return (
    <RequireAuth>
      <RessourcesHub />
    </RequireAuth>
  );
}
