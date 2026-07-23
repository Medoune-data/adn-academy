"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import RequireAdmin from "@/components/RequireAdmin";
import { db } from "@/lib/firebase";
import { getSecondaryAuth } from "@/lib/firebase-secondary";
import { FORMATIONS } from "@/lib/formations";

interface Student {
  id: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  enrolledFormations?: string[];
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const EMPTY_FORM = { name: "", whatsapp: "", email: "", password: generatePassword() };

function AdminEleves() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), (snap) => {
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Student)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleFormation = async (student: Student, slug: string) => {
    const current = student.enrolledFormations ?? [];
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    await updateDoc(doc(db, "students", student.id), { enrolledFormations: updated });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreated(null);
    try {
      const secondaryAuth = getSecondaryAuth();
      const cred = await createUserWithEmailAndPassword(secondaryAuth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      const newUid = cred.user.uid;
      // On déconnecte immédiatement la session secondaire — l'admin
      // reste connecté sur l'app principale pendant tout ce temps.
      await signOut(secondaryAuth);

      await setDoc(doc(db, "students", newUid), {
        name: form.name,
        whatsapp: form.whatsapp,
        email: form.email,
        enrolledFormations: [],
        createdAt: serverTimestamp(),
      });

      setCreated({ email: form.email, password: form.password });
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "code" in err && err.code === "auth/email-already-in-use"
          ? "Cet email a déjà un compte."
          : "Erreur lors de la création du compte.";
      alert(message);
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const copyCredentials = () => {
    if (!created) return;
    navigator.clipboard.writeText(
      `Identifiants ADN Academy\nEmail : ${created.email}\nMot de passe : ${created.password}\nConnexion : /connexion`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = students.filter((s) =>
    `${s.name ?? ""} ${s.email ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold mb-8 inline-block">
          ← Tableau de bord
        </Link>
        <p className="cell-label mb-4">Admin</p>
        <h1 className="font-display italic text-3xl md:text-4xl text-text mb-3">
          Élèves
        </h1>
        <p className="text-text-dim font-light mb-10 max-w-xl">
          Les comptes élèves ne sont créés que depuis ici — il n&apos;y a pas
          d&apos;inscription publique sur le site.
        </p>

        {/* CRÉATION DE COMPTE */}
        <form onSubmit={handleCreate} className="border border-border rounded-2xl p-8 bg-surface space-y-5 mb-6">
          <h2 className="font-display italic text-lg text-text mb-2">Créer un compte élève</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
                WhatsApp
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-bg border border-border rounded-lg p-3 text-text text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-2 block">
              Mot de passe (généré, modifiable)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="flex-1 bg-bg border border-border rounded-lg p-3 text-text text-sm font-mono outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, password: generatePassword() })}
                className="text-[10px] uppercase tracking-widest font-bold border border-border-strong px-4 rounded-lg text-text-dim hover:text-text transition-colors"
              >
                Régénérer
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-6 py-3.5 rounded-full hover:brightness-105 transition-all disabled:opacity-50"
          >
            {creating ? "Création..." : "Créer le compte →"}
          </button>
        </form>

        {created && (
          <div className="border border-accent/30 bg-accent-dim rounded-2xl p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-accent font-mono font-bold mb-2">
                Compte créé — transmets ces identifiants à l&apos;élève
              </p>
              <p className="text-text text-sm font-mono">{created.email} · {created.password}</p>
            </div>
            <button
              onClick={copyCredentials}
              className="text-[10px] uppercase tracking-widest font-bold border border-accent/40 px-4 py-2.5 rounded-full text-accent hover:bg-accent hover:text-bg transition-all flex-shrink-0"
            >
              {copied ? "✓ Copié" : "Copier"}
            </button>
          </div>
        )}

        {/* LISTE + ACCÈS */}
        <p className="cell-label mb-4">Comptes existants</p>
        <input
          type="text"
          placeholder="Rechercher un élève (nom ou email)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border rounded-lg p-3.5 text-text text-sm outline-none focus:border-accent transition-colors mb-8"
        />

        {loading ? (
          <p className="text-text-faint font-mono text-xs animate-pulse">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-text-dim font-light">Aucun élève trouvé.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((s) => (
              <div key={s.id} className="border border-border rounded-2xl p-6 bg-surface">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-text font-medium">{s.name || "Sans nom"}</p>
                    <p className="text-text-faint text-xs font-mono">{s.email}{s.whatsapp ? ` · ${s.whatsapp}` : ""}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {FORMATIONS.map((f) => {
                    const active = s.enrolledFormations?.includes(f.slug);
                    return (
                      <button
                        key={f.slug}
                        onClick={() => toggleFormation(s, f.slug)}
                        className={`text-[10px] font-mono uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                          active
                            ? "bg-accent text-bg border-accent"
                            : "border-border-strong text-text-dim hover:border-accent/50"
                        }`}
                      >
                        {active ? "✓ " : ""}{f.title.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminElevesPage() {
  return (
    <RequireAdmin>
      <AdminEleves />
    </RequireAdmin>
  );
}
