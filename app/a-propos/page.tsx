import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre mission",
  description:
    "ADN Community rend la data accessible à l'Afrique francophone. Découvre notre histoire, notre académie et l'équipe derrière ADN Academy.",
};

const TEAM = [
  {
    ref: "A1",
    name: "Haidara",
    role: "Webinaires & animation pédagogique",
  },
  {
    ref: "B1",
    name: "Tanoe",
    role: "Supervision des challenges & suivi des élèves",
  },
];

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
            ADN Community est née d&apos;un constat simple : trop de talents en
            Afrique francophone abandonnent la data en cours de route, non pas
            par manque de capacité, mais parce qu&apos;elle leur est enseignée
            comme une matière abstraite, déconnectée du réel.
          </p>
          <p>
            Nous avons commencé par un espace d&apos;entraide gratuit, ouvert à
            tous — ADN Community. De cette communauté est née ADN Academy,
            notre académie, avec de vrais jeux de données d&apos;entreprise, des
            séances en direct où chaque question trouve une réponse, et un
            suivi qui continue bien après la fin des cours.
          </p>
          <p>
            Notre objectif n&apos;est pas de délivrer un certificat de plus, mais
            de former des analystes capables de manipuler, questionner et
            présenter la donnée avec confiance — sur Excel, sur SQL, sur R.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <p className="cell-label mb-8">B0 — L&apos;équipe</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAM.map((t) => (
            <div key={t.ref} className="border border-border rounded-2xl p-8 bg-surface/40">
              <span className="font-mono text-[10px] text-text-faint block mb-4">{t.ref}</span>
              <h3 className="font-display italic text-xl text-text mb-2">{t.name}</h3>
              <p className="text-text-dim text-sm font-light">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
