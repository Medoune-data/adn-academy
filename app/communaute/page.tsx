import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ADN Community",
  description:
    "Rejoins ADN Community, la communauté WhatsApp gratuite pour apprendre la data en français : Excel, SQL, R.",
};

export default function CommunautePage() {
  const perks = [
    {
      ref: "A1",
      title: "Entraide en direct",
      desc: "Pose une question sur une formule Excel, une requête SQL ou un script R, la communauté répond.",
    },
    {
      ref: "B1",
      title: "Partage de ressources",
      desc: "Jeux de données, templates, corrections d'exercices circulent librement entre membres.",
    },
    {
      ref: "C1",
      title: "Annonces prioritaires",
      desc: "Nouvelles sessions, places limitées, webinaires gratuits : la communauté est informée en premier.",
    },
  ];

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <p className="cell-label mb-4 justify-center flex">A0 — ADN Community</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-6">
          Apprendre la data, ensemble.
        </h1>
        <p className="text-text-dim font-light leading-relaxed max-w-xl mx-auto">
          ADN Community est notre groupe WhatsApp gratuit et ouvert à tous les
          francophones qui veulent progresser en data — élèves d&apos;ADN Academy
          ou simples curieux.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {perks.map((p) => (
          <div key={p.ref} className="border border-border rounded-2xl p-8 bg-surface/40">
            <span className="font-mono text-[10px] text-text-faint block mb-4">{p.ref}</span>
            <h3 className="font-display italic text-lg text-text mb-3">{p.title}</h3>
            <p className="text-text-dim text-sm font-light leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center border border-accent/30 bg-accent-dim rounded-2xl p-12">
        <h2 className="font-display italic text-2xl md:text-3xl text-text mb-4">
          Prêt à rejoindre ADN Community ?
        </h2>
        <p className="text-text-dim font-light mb-8">
          Un message, et tu es dans le groupe.
        </p>
        <a
          href="https://wa.me/2250564094530?text=Bonjour%2C%20je%20souhaite%20rejoindre%20ADN%20Community"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-8 py-4 rounded-md hover:brightness-110 transition-all"
        >
          Rejoindre sur WhatsApp →
        </a>
      </div>
    </main>
  );
}
