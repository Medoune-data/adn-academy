import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre mission",
  description:
    "ADN Community rend la data accessible à l'Afrique francophone. Découvre notre histoire, notre académie et l'équipe derrière ADN Academy.",
  alternates: { canonical: "/a-propos" },
};

// Quand une vraie photo est prête, dépose-la dans /public/team/ (ex: /public/team/medoune.jpg)
// et renseigne le champ `photo` ci-dessous — l'avatar par initiales disparaît automatiquement.
const TEAM = [
  {
    ref: "A1",
    name: "Medoune Camara",
    role: "Fondateur — économiste et analyste de données",
    photo: null as string | null, // ex: "/team/medoune.jpg"
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function AProposPage() {
  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto mb-24">
        <p className="cell-label mb-4">A0 — Mission</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-10 leading-tight">
          Une compétence data vaut ce qu&apos;elle permet de décider.
        </h1>
        <div className="prose-adn">
          <p>
            ADN Community est née d&apos;une conviction de son fondateur,{" "}
            <strong className="text-text font-medium">Medoune Camara</strong>,
            économiste et analyste de données : savoir utiliser un outil ne
            suffit pas, il faut savoir résoudre un vrai problème économique ou
            financier. Trop de formations enseignent Excel, SQL ou Power BI comme
            des fins en soi et laissent de côté la question qui compte : quelle
            décision cette donnée doit-elle permettre de prendre ?
          </p>
          <p>
            Tout a commencé par un espace d&apos;entraide gratuit sur WhatsApp,
            ADN Community. De cette communauté est née ADN Academy, avec une règle
            pour chaque formation : jamais un outil sans un cas business réel
            derrière. Nos parcours s&apos;appuient sur un même jeu de données
            d&apos;entreprise du début à la fin, des séances en direct où chaque
            question trouve une réponse, et un projet final soutenu devant jury.
          </p>
          <p>
            Notre ambition dépasse la formation individuelle : faire de la donnée
            un levier concret pour les entreprises et l&apos;économie ivoirienne,
            en formant des analystes capables de manipuler, questionner et
            présenter la donnée avec la rigueur d&apos;un économiste.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <p className="cell-label mb-6">B0 — L&apos;équipe</p>
        <div className="border-y border-border">
          {TEAM.map((t) => (
            <div key={t.ref} className="flex items-center gap-6 py-8">
              <span className="font-mono text-[11px] text-text-faint w-8 flex-shrink-0">{t.ref}</span>
              {t.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover border border-border-strong"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-sm border border-accent/30"
                  style={{ background: "var(--adn-accent)", color: "var(--adn-bg, #fff)" }}
                >
                  {initials(t.name)}
                </div>
              )}
              <div>
                <h3 className="font-display italic text-xl text-text">{t.name}</h3>
                <p className="text-text-dim text-sm font-light mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
