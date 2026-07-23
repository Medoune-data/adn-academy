import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacte ADN Academy par WhatsApp ou email pour toute question sur nos formations.",
};

export default function ContactPage() {
  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <p className="cell-label mb-4 justify-center flex">A0 — Contact</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-text mb-6">
          Parlons-en.
        </h1>
        <p className="text-text-dim font-light leading-relaxed mb-16">
          Une question sur une formation, un partenariat, ou juste envie d&apos;en
          savoir plus sur ADN Academy — écris-nous.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://wa.me/2250564094530"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border rounded-2xl p-8 bg-surface/40 hover:border-accent/40 transition-all"
          >
            <span className="font-mono text-[10px] text-text-faint block mb-4">A1</span>
            <h3 className="font-display italic text-xl text-text mb-2">WhatsApp</h3>
            <p className="text-text-dim text-sm font-light">Réponse la plus rapide</p>
          </a>

          <a
            href="mailto:contact@adn-academy.com"
            className="border border-border rounded-2xl p-8 bg-surface/40 hover:border-accent/40 transition-all"
          >
            <span className="font-mono text-[10px] text-text-faint block mb-4">B1</span>
            <h3 className="font-display italic text-xl text-text mb-2">Email</h3>
            <p className="text-text-dim text-sm font-light">Pour les demandes détaillées</p>
          </a>
        </div>
      </div>
    </main>
  );
}
