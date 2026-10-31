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
    role: "Fondateur — Economist & Business Analyst",
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
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-8 leading-tight">
          Rendre la data accessible, pas intimidante.
        </h1>
        <div className="prose-adn">
          <p>
            ADN Community est née d&apos;une conviction simple, portée par son
            fondateur <strong className="text-text font-medium">Medoune Camara</strong>,
            économiste et analyste de données : une compétence data n&apos;a de
            valeur que si elle sait résoudre un vrai problème économique ou
            financier — pas seulement faire fonctionner un outil. Trop de
            formations enseignent Excel, SQL ou Power BI comme des fins en
            soi, en laissant de côté la question qui compte vraiment : quelle
            décision cette donnée doit-elle permettre de prendre ?
          </p>
          <p>
            Tout a commencé par un espace d&apos;entraide gratuit et ouvert à
            tous, sur WhatsApp — ADN Community. De cette communauté est née
            ADN Academy, avec une règle qui guide chaque formation : jamais un
            outil sans un cas business réel derrière. Nos parcours s&apos;appuient
            sur un même jeu de données d&apos;entreprise du début à la fin, des
            séances en direct où chaque question trouve une réponse, et un
            projet final soutenu devant jury, pas un simple quiz de fin de
            cours.
          </p>
          <p>
            Notre ambition dépasse la formation individuelle : faire de la
            donnée un levier concret pour les entreprises et l&apos;économie
            ivoirienne — former des analystes capables de manipuler,
            questionner et présenter la donnée avec la même rigueur qu&apos;un
            économiste, pas seulement délivrer un certificat de plus.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <p className="cell-label mb-8">B0 — L&apos;équipe</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAM.map((t) => (
            <div key={t.ref} className="border border-border rounded-2xl p-8 bg-surface/40">
              <span className="font-mono text-[10px] text-text-faint block mb-4">{t.ref}</span>
              <div className="flex items-center gap-4 mb-2">
                {t.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border border-border-strong"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-sm border border-accent/30"
                    style={{ background: "var(--adn-accent)", color: "var(--adn-bg, #fff)" }}
                  >
                    {initials(t.name)}
                  </div>
                )}
                <h3 className="font-display italic text-xl text-text">{t.name}</h3>
              </div>
              <p className="text-text-dim text-sm font-light mt-2">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
