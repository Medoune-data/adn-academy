import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FORMATIONS, getFormation } from "@/lib/formations";

export function generateStaticParams() {
  return FORMATIONS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formation = getFormation(slug);
  if (!formation) return {};
  return {
    title: formation.title,
    description: formation.description,
    openGraph: {
      title: `${formation.title} | ADN Academy`,
      description: formation.description,
    },
  };
}

export default async function FormationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const formation = getFormation(slug);
  if (!formation) notFound();

  const whatsappUrl = `https://wa.me/2250564094530?text=${encodeURIComponent(formation.whatsappMessage)}`;

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link href="/formations" className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold mb-10 inline-block hover:translate-x-[-4px] transition-transform">
          ← Toutes les formations
        </Link>

        <span className="font-mono text-[10px] text-text-faint">{formation.cellRef}</span>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mt-3 mb-5 leading-tight">
          {formation.title}
        </h1>
        <p className="text-xl text-text-dim font-light italic border-l border-border pl-6 mb-12 max-w-2xl">
          {formation.tagline}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-10">
            <div>
              <p className="cell-label mb-4">Programme</p>
              <p className="text-text-dim font-light leading-relaxed">{formation.description}</p>
            </div>

            <div>
              <p className="cell-label mb-4">Compétences validées</p>
              <ul className="space-y-3">
                {formation.skills.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-text-dim text-sm font-light">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="border border-border rounded-2xl p-8 bg-surface/50 h-fit space-y-6">
            <div className="flex justify-between text-sm">
              <span className="text-text-faint font-mono text-[10px] uppercase tracking-widest">Durée</span>
              <span className="text-text">{formation.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-faint font-mono text-[10px] uppercase tracking-widest">Niveau</span>
              <span className="text-text">{formation.level}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-6">
              <span className="text-text-faint font-mono text-[10px] uppercase tracking-widest">Tarif</span>
              <span className="text-text font-medium text-lg">{formation.price}</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-6 py-4 rounded-md hover:brightness-110 transition-all"
            >
              S&apos;inscrire via WhatsApp →
            </a>
            <p className="text-text-faint text-[11px] font-light text-center leading-relaxed">
              Paiement par Mobile Money, confirmé directement avec l&apos;équipe ADN.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
