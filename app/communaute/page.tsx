import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ADN Community",
  description:
    "Rejoins ADN Community : webinaires mensuels, séminaires, mini-concours, sensibilisation en écoles et bootcamps. La communauté data francophone qui apprend en faisant.",
  alternates: { canonical: "/communaute" },
};

const ACTIVITIES = [
  {
    ref: "A1",
    title: "Webinaires mensuels",
    cadence: "Chaque mois · en ligne · gratuit",
    desc: "Un professionnel — banque, télécom, ONG — vient présenter un problème économique réel qu'il a résolu avec de la donnée. Pas de cours, du concret.",
  },
  {
    ref: "B1",
    title: "Séminaires trimestriels",
    cadence: "Chaque trimestre · en présentiel",
    desc: "Une demi-journée d'approfondissement sur un thème sectoriel — agriculture, mobile money, secteur informel — avec des ateliers pratiques.",
  },
  {
    ref: "C1",
    title: "Mini-concours",
    cadence: "Chaque trimestre · en équipe",
    desc: "Un vrai cas business, un jeu de données fourni, une recommandation à défendre devant un jury d'entreprises partenaires. Le meilleur moyen de te faire repérer.",
  },
  {
    ref: "D1",
    title: "Sensibilisation en écoles",
    cadence: "Sur invitation · 1 à 2h",
    desc: "Des interventions dans les écoles et universités pour démystifier la data et l'IA — et donner envie à d'autres de rejoindre l'aventure.",
  },
  {
    ref: "E1",
    title: "Bootcamps",
    cadence: "Ponctuels · intensifs",
    desc: "Des formats courts (1 à 2 jours) sur un sujet ciblé — Power BI pour le pilotage, IA générative pour les pros — pensés pour les professionnels et les entreprises.",
  },
];

export default function CommunautePage() {
  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <p className="cell-label mb-4 justify-center flex">A0 — ADN Community</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-6">
          Apprendre la data, ensemble.
        </h1>
        <p className="text-text-dim font-light leading-relaxed max-w-xl mx-auto">
          ADN Community est notre espace gratuit et ouvert à tous les
          francophones qui veulent progresser en data — élèves d&apos;ADN
          Academy ou simples curieux. Au-delà du groupe WhatsApp, c&apos;est un
          vrai rythme d&apos;activités qui te fait pratiquer, rencontrer et te
          faire connaître.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-20">
        <p className="cell-label mb-8">Ce qui rythme la communauté</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACTIVITIES.map((a) => (
            <div key={a.ref} className="border border-border rounded-2xl p-8 bg-surface/40">
              <span className="font-mono text-[10px] text-text-faint block mb-4">{a.ref}</span>
              <h3 className="font-display italic text-lg text-text mb-1">{a.title}</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">
                {a.cadence}
              </p>
              <p className="text-text-dim text-sm font-light leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center border border-accent/30 bg-accent-dim rounded-2xl p-12">
        <h2 className="font-display italic text-2xl md:text-3xl text-text mb-4">
          Prêt à rejoindre ADN Community ?
        </h2>
        <p className="text-text-dim font-light mb-8">
          Un message, et tu es dans le groupe — tu reçois ensuite les annonces
          de chaque webinaire, concours et bootcamp.
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
