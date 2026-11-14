import Link from "next/link";
import { FORMATIONS } from "@/lib/formations";
import Reveal from "@/components/Reveal";

const WHATSAPP_JOIN =
  "https://wa.me/2250564094530?text=Bonjour%2C%20je%20souhaite%20rejoindre%20ADN%20Community";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="pt-44 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            {/* Barre de formule : le clin d'œil Excel de la marque */}
            <div className="inline-flex items-stretch border border-border rounded-md overflow-hidden mb-10 font-mono text-[11px]">
              <span className="px-3 py-2 bg-surface text-accent font-bold italic border-r border-border">
                fx
              </span>
              <span className="px-4 py-2 text-text-dim">=APPRENDRE(Excel; SQL; R)</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-text mb-8 max-w-3xl">
              Apprendre la data sur des{" "}
              <span className="italic text-accent">cas d&apos;entreprise réels.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-text-dim text-lg font-light leading-relaxed max-w-xl mb-12">
              ADN est une communauté de passionnés de data en Afrique francophone.
              Le groupe WhatsApp en est le point de départ ; notre académie,{" "}
              <strong className="text-text font-medium">ADN Academy</strong>, forme à
              Excel, SQL et R en direct, avec un projet final et un certificat
              vérifiable en ligne.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-wrap gap-4">
              <a
                href={WHATSAPP_JOIN}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:brightness-105 shadow-[0_8px_24px_-8px_rgba(217,98,43,0.5)] transition-all"
              >
                Rejoindre le groupe →
              </a>
              <Link
                href="/formations"
                className="border border-border-strong text-text font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:border-accent/60 hover:bg-surface transition-all"
              >
                Voir les formations
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FORMATIONS — présentées comme une feuille de calcul */}
      <section className="border-y border-border bg-surface/60 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="cell-label mb-4">ADN Academy</p>
            <h2 className="font-display italic text-3xl md:text-4xl text-text mb-4 max-w-2xl">
              Excel, SQL et R, en direct.
            </h2>
            <p className="text-text-dim font-light leading-relaxed max-w-xl mb-12">
              Chaque formation suit un même jeu de données d&apos;entreprise du
              début à la fin, avec des séances en direct en petit groupe.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="border border-border rounded-xl overflow-hidden bg-bg">
              <div className="hidden md:grid grid-cols-[4rem_1fr_10rem_9rem_3rem] bg-surface border-b border-border font-mono text-[10px] uppercase tracking-widest text-text-faint">
                <span className="px-4 py-2.5 border-r border-border" />
                <span className="px-6 py-2.5">Formation</span>
                <span className="px-4 py-2.5">Niveau</span>
                <span className="px-4 py-2.5">Durée</span>
                <span />
              </div>

              {FORMATIONS.map((f) => (
                <Link
                  key={f.slug}
                  href={`/formations/${f.slug}`}
                  className="group grid grid-cols-[3.5rem_1fr] md:grid-cols-[4rem_1fr_10rem_9rem_3rem] items-stretch border-b border-border last:border-b-0 hover:bg-accent-dim transition-colors"
                >
                  <span className="font-mono text-[11px] text-text-faint bg-surface border-r border-border px-4 py-6 flex items-start md:items-center">
                    {f.cellRef}
                  </span>
                  <div className="px-6 py-6">
                    <p className="font-display italic text-xl text-text group-hover:text-accent transition-colors">
                      {f.title}
                    </p>
                    <p className="text-text-dim text-sm font-light mt-1">{f.tagline}</p>
                    <p className="md:hidden font-mono text-[10px] uppercase tracking-widest text-text-faint mt-3">
                      {f.level} · {f.duration}
                    </p>
                  </div>
                  <span className="hidden md:flex items-center px-4 font-mono text-[11px] text-text-dim">
                    {f.level}
                  </span>
                  <span className="hidden md:flex items-center px-4 font-mono text-[11px] text-text-dim">
                    {f.duration}
                  </span>
                  <span className="hidden md:flex items-center justify-center text-accent">→</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <Reveal>
            <div className="md:col-span-5">
              <p className="cell-label mb-4">Notre histoire</p>
              <h2 className="font-display italic text-3xl md:text-4xl text-text leading-tight">
                Né d&apos;un groupe WhatsApp.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="md:col-span-7 space-y-5 text-text-dim font-light leading-relaxed">
              <p>
                ADN a commencé comme un espace d&apos;entraide : on y partage des
                fichiers, des questions et des solutions autour de la data. De cet
                espace est née ADN Academy, pour ceux qui veulent structurer leur
                apprentissage.
              </p>
              <p>
                Chaque formation se termine par un projet concret et un certificat
                que n&apos;importe quel recruteur peut vérifier en ligne.
              </p>
              <p className="flex flex-wrap gap-x-8 gap-y-2 pt-2">
                <Link href="/communaute" className="text-xs uppercase tracking-[0.2em] font-bold text-accent hover:underline">
                  La communauté →
                </Link>
                <Link href="/a-propos" className="text-xs uppercase tracking-[0.2em] font-bold text-accent hover:underline">
                  Notre mission →
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <Reveal>
          <div className="max-w-5xl mx-auto border border-accent/30 bg-accent-dim rounded-2xl p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-md">
              <h2 className="font-display italic text-2xl md:text-3xl text-text mb-3">
                Rejoindre le groupe WhatsApp
              </h2>
              <p className="text-text-dim font-light leading-relaxed">
                Échange avec d&apos;autres apprenants, pose tes questions, partage
                tes fichiers Excel, SQL et R.
              </p>
            </div>
            <a
              href={WHATSAPP_JOIN}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-center bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:brightness-105 shadow-[0_8px_24px_-8px_rgba(217,98,43,0.5)] transition-all"
            >
              Rejoindre →
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
