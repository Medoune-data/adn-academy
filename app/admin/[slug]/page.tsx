"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import RequireAdmin from "@/components/RequireAdmin";
import { db } from "@/lib/firebase";
import { getFormation } from "@/lib/formations";
import { extractYoutubeId } from "@/lib/admin-utils";
import { getFichiers } from "@/lib/fichiers";

interface Seance {
  id: string;
  semaine: string;
  titre: string;
  description: string;
  youtubeId: string;
  date: string;
}

const EMPTY_FORM = {
  semaine: "",
  titre: "",
  description: "",
  youtubeUrl: "",
  date: "",
};

function AdminSeances() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const formation = getFormation(slug);

  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "formations", slug, "seances"), orderBy("date", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setSeances(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Seance)));
      setLoading(false);
    });
    return () => unsub();
  }, [slug]);

  if (!formation) {
    return <main className="pt-40 px-6 text-center text-text-dim">Formation introuvable.</main>;
  }

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        semaine: form.semaine,
        titre: form.titre,
        description: form.description,
        youtubeId: extractYoutubeId(form.youtubeUrl),
        date: form.date,
      };
      if (editingId) {
        await updateDoc(doc(db, "formations", slug, "seances", editingId), payload);
      } else {
        await addDoc(collection(db, "formations", slug, "seances"), payload);
      }
      resetForm();
    } catch (e) {
      alert("Erreur lors de l'enregistrement.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (s: Seance) => {
    setEditingId(s.id);
    setForm({
      semaine: s.semaine,
      titre: s.titre,
      description: s.description,
      youtubeUrl: s.youtubeId,
      date: s.date,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (s: Seance) => {
    if (!confirm(`Supprimer la séance "${s.titre}" ?`)) return;
    await deleteDoc(doc(db, "formations", slug, "seances", s.id));
  };

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin" className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold mb-8 inline-block">
          ← Tableau de bord
        </Link>
        <p className="cell-label mb-4">{formation.cellRef} — Admin</p>
        <h1 className="font-display italic text-3xl md:text-4xl text-text mb-3">
          {formation.title}
        </h1>
        <p className="text-text-dim text-sm font-light mb-10 max-w-xl">
          Ajoute ici le lien de rediffusion et le titre de chaque séance.
          Les fichiers à télécharger se gèrent séparément dans le code
          (<code className="font-mono text-accent">lib/fichiers.ts</code>),
          associés au même libellé de « Semaine ».
        </p>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="border border-border rounded-2xl p-8 bg-surface space-y-5 mb-16">
          <h2 className="font-display italic text-lg text-text mb-2">
            {editingId ? "Modifier la séance" : "Ajouter une séance"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                Semaine
              </label>
              <input
                type="text"
                required
                placeholder="Semaine 1"
                value={form.semaine}
                onChange={(e) => setForm({ ...form, semaine: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                Date
              </label>
              <input
                type="text"
                required
                placeholder="Samedi 21 Mars 2026"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Titre
            </label>
            <input
              type="text"
              required
              placeholder="Rediffusion de la Séance du Samedi 21/03"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Lien YouTube (rediffusion)
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-6 py-3.5 rounded-full hover:brightness-105 transition-all disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : editingId ? "Mettre à jour →" : "Publier la séance →"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-border-strong text-text-dim font-mono text-xs uppercase tracking-[0.2em] px-6 py-3.5 rounded-full hover:text-text transition-all"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        {/* LISTE DES SEANCES */}
        <p className="cell-label mb-6">Séances publiées</p>
        {loading ? (
          <p className="text-text-faint font-mono text-xs animate-pulse">Chargement...</p>
        ) : seances.length === 0 ? (
          <p className="text-text-dim font-light">Aucune séance pour l&apos;instant.</p>
        ) : (
          <div className="space-y-4">
            {[...seances].reverse().map((s) => {
              const nbFichiers = getFichiers(slug, s.semaine).length;
              return (
                <div key={s.id} className="border border-border rounded-2xl p-6 bg-surface flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-text-faint">{s.semaine} · {s.date}</span>
                    <h3 className="text-text font-medium">{s.titre}</h3>
                    <span className="text-text-faint text-xs">
                      {s.youtubeId ? "Replay lié" : "Pas de replay"} · {nbFichiers} fichier(s) en code
                    </span>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <button onClick={() => startEdit(s)} className="text-accent text-xs uppercase tracking-widest hover:underline">
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(s)} className="text-red-500 text-xs uppercase tracking-widest hover:underline">
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminSeancesPage() {
  return (
    <RequireAdmin>
      <AdminSeances />
    </RequireAdmin>
  );
}
