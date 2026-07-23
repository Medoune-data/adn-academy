"use client";

import Link from "next/link";
import RequireAdmin from "@/components/RequireAdmin";
import { FORMATIONS } from "@/lib/formations";

function Dashboard() {
  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <p className="cell-label mb-4">Admin</p>
        <h1 className="font-display italic text-3xl md:text-5xl text-text mb-3">
          Tableau de bord
        </h1>
        <p className="text-text-dim font-light mb-14">
          Gère les séances, les certificats, et les accès élèves.
        </p>

        <p className="cell-label mb-4">Ressources par formation</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {FORMATIONS.map((f) => (
            <Link
              key={f.slug}
              href={`/admin/${f.slug}`}
              className="border border-border rounded-2xl p-8 bg-surface hover:border-accent/40 transition-all"
            >
              <span className="font-mono text-[10px] text-text-faint block mb-4">{f.cellRef}</span>
              <h3 className="font-display italic text-xl text-text mb-3">{f.title}</h3>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                Gérer les séances →
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <p className="cell-label mb-4">Élèves</p>
            <Link
              href="/admin/eleves"
              className="block border border-border rounded-2xl p-8 bg-surface hover:border-accent/40 transition-all h-full"
            >
              <h3 className="font-display italic text-xl text-text mb-3">Accès élèves</h3>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                Activer une formation par élève →
              </span>
            </Link>
          </div>
          <div>
            <p className="cell-label mb-4">Certification</p>
            <Link
              href="/admin/certificats"
              className="block border border-border rounded-2xl p-8 bg-surface hover:border-accent/40 transition-all h-full"
            >
              <h3 className="font-display italic text-xl text-text mb-3">Certificats</h3>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                Créer & gérer les certificats →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <RequireAdmin>
      <Dashboard />
    </RequireAdmin>
  );
}
