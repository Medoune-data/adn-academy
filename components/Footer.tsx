import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-display italic text-xl text-text">ADN</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent border border-accent/30 px-1.5 py-0.5 rounded-full">
              Community
            </span>
          </div>
          <p className="text-text-dim text-sm font-light leading-relaxed max-w-xs">
            La communauté data francophone — et son académie, ADN Academy —
            pour l'Afrique francophone.
          </p>
        </div>

        <div>
          <p className="cell-label mb-4">B1 — Navigation</p>
          <ul className="space-y-3 text-sm text-text-dim font-light">
            <li><Link href="/formations" className="hover:text-text transition-colors">Formations</Link></li>
            <li><Link href="/communaute" className="hover:text-text transition-colors">Communauté</Link></li>
            <li><Link href="/a-propos" className="hover:text-text transition-colors">Notre mission</Link></li>
          </ul>
        </div>

        <div>
          <p className="cell-label mb-4">C1 — Élèves</p>
          <ul className="space-y-3 text-sm text-text-dim font-light">
            <li><Link href="/connexion" className="hover:text-text transition-colors">Connexion</Link></li>
            <li><Link href="/inscription" className="hover:text-text transition-colors">Rejoindre une formation</Link></li>
            <li><Link href="/espace-eleve" className="hover:text-text transition-colors">Espace élève</Link></li>
          </ul>
        </div>

        <div>
          <p className="cell-label mb-4">D1 — Contact</p>
          <ul className="space-y-3 text-sm text-text-dim font-light">
            <li>
              <a href="https://wa.me/2250564094530" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">
                WhatsApp
              </a>
            </li>
            <li><Link href="/contact" className="hover:text-text transition-colors">Nous écrire</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint">
          © {new Date().getFullYear()} ADN Community — Côte d'Ivoire
        </p>
      </div>
    </footer>
  );
}
