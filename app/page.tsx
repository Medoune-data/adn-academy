import Link from "next/link";
import { FORMATIONS } from "@/lib/formations";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative pt-44 pb-28 px-6 overflow-hidden">
        <div
          className="blob w-[420px] h-[420px] -top-32 -left-32"
          style={{ background: "var(--adn-accent)" }}
        />
        <div
          className="blob w-[360px] h-[360px] top-10 right-[-120px]"
          style={{ background: "var(--adn-teal)", animationDelay: "3s" }}
        />

        <div className="relative max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-8 font-mono text-[11px] text-text-dim">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>ADN Community — Excel · SQL · R · Afrique francophone</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-text mb-8 max-w-3xl">
              Une communauté qui apprend{" "}
              <span className="italic text-accent">la data ensemble.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-text-dim text-lg font-light leading-relaxed max-w-xl mb-12">
              ADN Community rassemble des passionnés de data en Afrique francophone —
              gratuitement sur WhatsApp. Pour ceux qui veulent aller plus loin,
              notre académie, <strong className="text-text font-medium">ADN Academy</strong>,
              forme aux métiers de la donnée : Excel, SQL, R.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/2250564094530?text=Bonjour%2C%20je%20souhaite%20rejoindre%20ADN%20Community"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:brightness-105 shadow-[0_8px_24px_-8px_rgba(217,98,43,0.5)] transition-all"
              >
                Rejoindre la communauté →
              </a>
              <Link
                href="/formations"
                className="border border-border-strong text-text font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:border-accent/60 hover:bg-surface transition-all"
              >
                Découvrir ADN Academy
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-surface/60">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { label: "Communauté", value: "ADN Community", sub: "gratuite, WhatsApp" },
            { label: "Académie", value: "3 formations", sub: "Excel · SQL · R" },
            { label: "Format", value: "100% en direct", sub: "petits groupes" },
            { label: "Certification", value: "Vérifiable", sub: "en ligne" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 60}>
              <div className="border-r border-border last:border-r-0 p-8 text-center h-full">
                <p className="font-display italic text-lg md:text-xl text-text mb-1">{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-accent font-mono font-bold mb-1">{s.label}</p>
                <p className="text-[11px] text-text-faint">{s.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NOTRE HISTOIRE — story arc: community -> academy -> certification */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <Reveal>
          <p className="cell-label mb-4">Notre histoire</p>
          <h2 className="font-display italic text-3xl md:text-4xl text-text mb-16 max-w-2xl">
            D&apos;un groupe WhatsApp à une véritable académie.
          </h2>
        </Reveal>

        <div className="relative">
          <div className="hidden md:block absolute left-[27px] top-4 bottom-4 w-px story-dots" />
          <div className="space-y-14">
            {[
              {
                num: "01",
                title: "ADN Community",
                text: "Tout commence par l'entraide : un groupe WhatsApp gratuit où l'on partage fichiers, questions et solutions autour de la data.",
                link: { href: "/communaute", label: "Voir la communauté" },
              },
              {
                num: "02",
                title: "ADN Academy",
                text: "Pour ceux qui veulent structurer leur apprentissage, des formations en direct — Excel, SQL, R — avec projets réels et suivi personnalisé.",
                link: { href: "/formations", label: "Voir les formations" },
              },
              {
                num: "03",
                title: "Certification",
                text: "Chaque formation se termine par un projet concret et un certificat vérifiable en ligne, à partager avec confiance.",
                link: null,
              },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div className="flex gap-6 md:gap-10">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent-dim border border-accent/30 flex items-center justify-center font-mono text-accent font-bold text-sm z-10 bg-bg">
                    {step.num}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-display italic text-2xl text-text mb-3">{step.title}</h3>
                    <p className="text-text-dim font-light leading-relaxed max-w-xl mb-3">{step.text}</p>
                    {step.link && (
                      <Link href={step.link.href} className="text-xs uppercase tracking-[0.2em] font-bold text-accent hover:underline">
                        {step.link.label} →
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATIONS PREVIEW */}
      <section className="border-t border-border bg-surface/60 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="cell-label mb-4">ADN Academy</p>
            <h2 className="font-display italic text-3xl md:text-4xl text-text mb-14">
              Trois parcours, un seul objectif : la maîtrise.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMATIONS.map((f, i) => (
              <Reveal key={f.slug} delay={i * 90}>
                <Link
                  href={`/formations/${f.slug}`}
                  className="group border border-border rounded-3xl p-8 bg-surface hover:border-accent/40 hover:shadow-[0_16px_40px_-24px_rgba(36,30,23,0.25)] transition-all flex flex-col h-full"
                >
                  <span className="font-mono text-[10px] text-text-faint mb-6">{f.cellRef}</span>
                  <h3 className="font-display italic text-xl text-text mb-3 group-hover:text-accent transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-text-dim text-sm font-light leading-relaxed mb-6 flex-1">
                    {f.tagline}
                  </p>
                  <div className="flex items-center justify-between pt-5 border-t border-border">
                    <span className="font-mono text-[11px] text-text-dim">{f.price}</span>
                    <span className="text-[10px] uppercase tracking-widest text-accent">Détails →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY CTA */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <Reveal>
          <p className="cell-label mb-4 justify-center flex">ADN Community</p>
          <h2 className="font-display italic text-3xl md:text-4xl text-text mb-6">
            Une communauté data francophone, sur WhatsApp.
          </h2>
          <p className="text-text-dim font-light leading-relaxed max-w-lg mx-auto mb-10">
            Échange avec d&apos;autres apprenants, pose tes questions, partage tes
            fichiers Excel/SQL/R — gratuit et ouvert à tous.
          </p>
          <a
            href="https://wa.me/2250564094530?text=Bonjour%2C%20je%20souhaite%20rejoindre%20ADN%20Community"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:brightness-105 shadow-[0_8px_24px_-8px_rgba(217,98,43,0.5)] transition-all"
          >
            Rejoindre sur WhatsApp →
          </a>
        </Reveal>
      </section>
    </main>
  );
}
