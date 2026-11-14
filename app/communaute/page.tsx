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
    cadence: "Sur invitation · 1 à 2 h",
    desc: "Des interventions dans les écoles et universités pour démystifier la data et l'IA, et donner envie à d'autres de rejoindre l'aventure.",
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
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-20 max-w-2xl">
          <p className="cell-label mb-4">A0 — ADN Community</p>
          <h1 className="font-display italic text-4xl md:text-6xl text-text mb-6 leading-tight">
            Le groupe WhatsApp, et tout ce qui se passe autour.
          </h1>
          <p className="text-text-dim font-light leading-relaxed">
            ADN Community est ouverte à tous les francophones qui veulent
            progresser en data, élèves d&apos;ADN Academy ou simples curieux. En
            plus du groupe WhatsApp, un rythme d&apos;activités te permet de
            pratiquer, de rencontrer du monde et de te faire connaître.
          </p>
        </div>

        {/* Activités */}
        <p className="cell-label mb-6">Le rythme de la communauté</p>
        <div className="border-y border-border mb-24">
          {ACTIVITIES.map((a) => (
            <div
              key={a.ref}
              className="grid grid-cols-1 md:grid-cols-[3.5rem_15rem_1fr] gap-x-8 gap-y-3 py-8 border-b border-border last:border-b-0"
            >
              <span className="font-mono text-[11px] text-text-faint">{a.ref}</span>
              <div>
                <h3 className="font-display italic text-xl text-text mb-1">{a.title}</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {a.cadence}
                </p>
              </div>
              <p className="text-text-dim text-sm font-light leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Cellules */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          <div className="md:col-span-5">
            <p className="cell-label mb-4">Cellules locales</p>
            <h2 className="font-display italic text-2xl md:text-3xl text-text leading-tight">
              ADN s&apos;organise par ville.
            </h2>
          </div>
          <p className="md:col-span-7 text-text-dim font-light leading-relaxed">
            La première cellule ADN est celle de Bouaké. Les prochaines seront
            annoncées ici au fur et à mesure.
          </p>
        </div>

        {/* CTA */}
        <div className="border border-accent/30 bg-accent-dim rounded-2xl p-10 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="font-display italic text-2xl md:text-3xl text-text mb-3">
              Rejoindre ADN Community
            </h2>
            <p className="text-text-dim font-light leading-relaxed">
              Un message suffit pour entrer dans le groupe. Tu reçois ensuite les
              annonces de chaque webinaire, concours et bootcamp.
            </p>
          </div>
          <a
            href="https://wa.me/2250564094530?text=Bonjour%2C%20je%20souhaite%20rejoindre%20ADN%20Community"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-center bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:brightness-105 transition-all"
          >
            Rejoindre →
          </a>
        </div>
      </div>
    </main>
  );
}
