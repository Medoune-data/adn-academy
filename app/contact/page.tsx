import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacte ADN Academy par WhatsApp ou email pour toute question sur nos formations.",
  alternates: { canonical: "/contact" },
};

const CONTACTS = [
  {
    ref: "A1",
    label: "WhatsApp",
    value: "+225 05 64 09 45 30",
    note: "Réponse la plus rapide",
    href: "https://wa.me/2250564094530",
    external: true,
  },
  {
    ref: "B1",
    label: "Email",
    value: "contact.adn.academy@gmail.com",
    note: "Pour les demandes détaillées ou les partenariats",
    href: "mailto:contact.adn.academy@gmail.com",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="cell-label mb-4">A0 — Contact</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-6 leading-tight">
          Une question avant de t&apos;inscrire ?
        </h1>
        <p className="text-text-dim font-light leading-relaxed max-w-xl mb-14">
          Sur le contenu d&apos;une formation, le déroulement des séances, un
          partenariat ou la communauté : écris-nous, on te répond directement.
        </p>

        <div className="border-y border-border">
          {CONTACTS.map((c) => (
            <a
              key={c.ref}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group grid grid-cols-[3rem_1fr] md:grid-cols-[3.5rem_9rem_1fr_auto] items-center gap-x-6 gap-y-1 py-8 border-b border-border last:border-b-0 hover:bg-accent-dim transition-colors px-2"
            >
              <span className="font-mono text-[11px] text-text-faint">{c.ref}</span>
              <span className="font-display italic text-xl text-text group-hover:text-accent transition-colors">
                {c.label}
              </span>
              <div className="col-start-2 md:col-start-auto">
                <p className="text-text font-mono text-sm break-all">{c.value}</p>
                <p className="text-text-faint text-xs font-light mt-1">{c.note}</p>
              </div>
              <span className="hidden md:block text-accent">→</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
