import Link from "next/link";

export default function InscriptionPage() {
  return (
    <main className="pt-40 pb-24 px-6 min-h-screen flex items-start justify-center">
      <div className="max-w-md text-center">
        <p className="cell-label mb-4 justify-center flex">Inscription</p>
        <h1 className="font-display italic text-3xl md:text-4xl text-text mb-6">
          Les comptes sont créés par l&apos;équipe
        </h1>
        <p className="text-text-dim font-light leading-relaxed mb-10">
          Pour garantir la qualité du suivi, ADN Academy ne propose pas
          d&apos;inscription libre. Après confirmation de ton inscription à une
          formation, l&apos;équipe crée ton compte et t&apos;envoie tes identifiants
          par WhatsApp.
        </p>
        <div className="flex flex-col gap-3 items-center">
          <a
            href="https://wa.me/2250564094530?text=Bonjour%2C%20je%20souhaite%20m%27inscrire%20%C3%A0%20une%20formation%20ADN%20Academy"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:brightness-105 transition-all"
          >
            Demander mon inscription →
          </a>
          <Link href="/connexion" className="text-xs uppercase tracking-[0.2em] font-bold text-accent hover:underline mt-2">
            J&apos;ai déjà un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
