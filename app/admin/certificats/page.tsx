"use client";

import { useEffect, useState } from "react";
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
import { FORMATIONS } from "@/lib/formations";
import { getCourseConfig } from "@/lib/generateCertificate";

interface Certificate {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  duration: string;
  level: string;
  mention: string;
  projectUrl: string;
  projectDescription: string;
}

const EMPTY_FORM = {
  studentName: "",
  courseTitle: FORMATIONS[0].title,
  issueDate: "",
  duration: "12 heures",
  level: "Avancé",
  mention: "Bien",
  projectUrl: "",
  projectDescription: "",
};

function AdminCertificats() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "certificates"), orderBy("studentName", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setCerts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Certificate)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const f = (field: keyof typeof EMPTY_FORM, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "certificates", editingId), form);
      } else {
        await addDoc(collection(db, "certificates"), form);
      }
      resetForm();
    } catch (e) {
      alert("Erreur lors de l'enregistrement.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (c: Certificate) => {
    setEditingId(c.id);
    setForm({
      studentName: c.studentName,
      courseTitle: c.courseTitle,
      issueDate: c.issueDate,
      duration: c.duration || "",
      level: c.level || "",
      mention: c.mention || "Bien",
      projectUrl: c.projectUrl || "",
      projectDescription: c.projectDescription || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (c: Certificate) => {
    if (!confirm(`Supprimer le certificat de "${c.studentName}" ?`)) return;
    await deleteDoc(doc(db, "certificates", c.id));
  };

  const handleGeneratePDF = async (c: Certificate) => {
    setGeneratingId(c.id);
    try {
      const { generateCertificatePDF } = await import("@/lib/generateCertificate");
      await generateCertificatePDF({
        id: c.id,
        studentName: c.studentName,
        courseTitle: c.courseTitle,
        issueDate: c.issueDate,
        duration: c.duration,
        level: c.level,
        mention: c.mention,
        projectDescription: c.projectDescription,
        projectUrl: c.projectUrl,
      });
    } catch (e) {
      alert("Erreur lors de la génération du PDF.");
      console.error(e);
    } finally {
      setGeneratingId(null);
    }
  };

  const previewSkills = getCourseConfig(form.courseTitle).skills;

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin" className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold mb-8 inline-block">
          ← Tableau de bord
        </Link>
        <p className="cell-label mb-4">Admin</p>
        <h1 className="font-display italic text-3xl md:text-4xl text-text mb-10">
          Certificats
        </h1>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="border border-border rounded-2xl p-8 bg-surface space-y-5 mb-16">
          <h2 className="font-display italic text-lg text-text mb-2">
            {editingId ? "Modifier le certificat" : "Créer un certificat"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                Nom de l&apos;élève
              </label>
              <input
                type="text"
                required
                value={form.studentName}
                onChange={(e) => f("studentName", e.target.value)}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                Formation
              </label>
              <select
                value={form.courseTitle}
                onChange={(e) => f("courseTitle", e.target.value)}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors cursor-pointer"
              >
                {FORMATIONS.map((fo) => (
                  <option key={fo.slug} value={fo.title}>
                    {fo.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                Date (ex: Mars 2026)
              </label>
              <input
                type="text"
                required
                value={form.issueDate}
                onChange={(e) => f("issueDate", e.target.value)}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                Durée
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => f("duration", e.target.value)}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                Niveau
              </label>
              <select
                value={form.level}
                onChange={(e) => f("level", e.target.value)}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors cursor-pointer"
              >
                <option value="Fondamental">Fondamental</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Mention
            </label>
            <div className="flex flex-wrap gap-2">
              {["Passable", "Bien", "Très Bien", "Excellence"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => f("mention", m)}
                  className={`text-[10px] font-mono uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                    form.mention === m
                      ? "bg-accent text-bg border-accent"
                      : "border-border-strong text-text-dim hover:border-accent/50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Lien du projet (GitHub, etc. — optionnel)
            </label>
            <input
              type="text"
              value={form.projectUrl}
              onChange={(e) => f("projectUrl", e.target.value)}
              className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Description du projet final
            </label>
            <textarea
              rows={3}
              value={form.projectDescription}
              onChange={(e) => f("projectDescription", e.target.value)}
              className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div className="bg-accent-dim border border-accent/20 rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-accent font-mono font-bold mb-2">
              Compétences (préremplies automatiquement)
            </p>
            <p className="text-text-dim text-xs font-light leading-relaxed">
              {previewSkills.join(" · ")}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-6 py-3.5 rounded-full hover:brightness-105 transition-all disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : editingId ? "Mettre à jour →" : "Créer le certificat →"}
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

        {/* LISTE */}
        <p className="cell-label mb-6">Certificats délivrés</p>
        {loading ? (
          <p className="text-text-faint font-mono text-xs animate-pulse">Chargement...</p>
        ) : certs.length === 0 ? (
          <p className="text-text-dim font-light">Aucun certificat pour l&apos;instant.</p>
        ) : (
          <div className="space-y-4">
            {certs.map((c) => (
              <div key={c.id} className="border border-border rounded-2xl p-6 bg-surface">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-text font-medium">{c.studentName}</h3>
                    <p className="text-text-faint text-xs font-mono">
                      {c.courseTitle} {c.mention ? `· ${c.mention}` : ""} · {c.issueDate}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center flex-shrink-0">
                    <button onClick={() => startEdit(c)} className="text-accent text-xs uppercase tracking-widest hover:underline">
                      Modifier
                    </button>
                    <button
                      onClick={() => handleGeneratePDF(c)}
                      disabled={generatingId === c.id}
                      className="text-xs uppercase tracking-widest font-bold border border-accent/30 text-accent px-4 py-2 rounded-full hover:bg-accent hover:text-bg transition-all disabled:opacity-50"
                    >
                      {generatingId === c.id ? "Génération..." : "↓ PDF"}
                    </button>
                    <Link
                      href={`/verify/${c.id}`}
                      target="_blank"
                      className="text-text-faint text-xs font-mono hover:text-accent transition-colors"
                    >
                      /verify →
                    </Link>
                    <button onClick={() => handleDelete(c)} className="text-red-500 text-xs uppercase tracking-widest hover:underline">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminCertificatsPage() {
  return (
    <RequireAdmin>
      <AdminCertificats />
    </RequireAdmin>
  );
}
