import Link from "next/link";
import type { Metadata } from "next";
import { FORMATIONS } from "@/lib/formations";

export const metadata: Metadata = {
  title: "Formations Excel, SQL, R",
  description:
    "Découvre les formations data d'ADN Academy : Excel pour l'analyse de données, SQL pour le business, Data Science avec R. En direct, en petit groupe.",
};

export default function FormationsPage() {
  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="cell-label mb-4">A1 — Catalogue</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-6 max-w-2xl">
          Nos formations
        </h1>
        <p className="text-text-dim font-light leading-relaxed max-w-xl mb-16">
          Chaque formation est enseignée en direct, en petit groupe, avec des
          jeux de données réels et un accès à l&apos;espace ressources dès le
          premier jour.
        </p>

        <div className="space-y-6">
          {FORMATIONS.map((f) => (
            <div
              key={f.slug}
              className="border border-border rounded-2xl p-8 md:p-10 bg-surface/40 hover:border-accent/30 transition-all grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              <div className="md:col-span-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[10px] text-text-faint">{f.cellRef}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent border border-accent/30 rounded-full px-2.5 py-1">
                    {f.level}
                  </span>
                </div>
                <h2 className="font-display italic text-2xl md:text-3xl text-text mb-3">{f.title}</h2>
                <p className="text-text-dim font-light leading-relaxed mb-6">{f.description}</p>
                <div className="flex flex-wrap gap-2">
                  {f.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-mono uppercase tracking-wider text-text-dim border border-border rounded-full px-3 py-1.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-faint font-mono text-[11px] uppercase tracking-widest">Durée</span>
                    <span className="text-text">{f.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-faint font-mono text-[11px] uppercase tracking-widest">Tarif</span>
                    <span className="text-text font-medium">{f.price}</span>
                  </div>
                </div>
                <Link
                  href={`/formations/${f.slug}`}
                  className="text-center bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-6 py-3.5 rounded-md hover:brightness-110 transition-all"
                >
                  Voir le programme →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
