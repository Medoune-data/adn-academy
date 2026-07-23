"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/communaute", label: "Communauté" },
  { href: "/formations", label: "Académie" },
  { href: "/battle", label: "ADN Battle" },
  { href: "/a-propos", label: "Mission" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, isAdmin } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="font-display italic text-2xl text-text tracking-tight">ADN</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent border border-accent/30 px-1.5 py-0.5 rounded-full">
            Community
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${
                pathname === l.href ? "text-accent" : "text-text-dim hover:text-text"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {!loading && user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-[11px] uppercase tracking-[0.2em] font-medium text-amber hover:brightness-110 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/espace-eleve"
                className="text-[11px] uppercase tracking-[0.2em] font-medium text-text-dim hover:text-text transition-colors"
              >
                Espace élève
              </Link>
              <button
                onClick={() => signOut(auth)}
                className="text-[10px] uppercase tracking-[0.2em] font-bold border border-border-strong rounded-md px-4 py-2 text-text-dim hover:text-text hover:border-accent/50 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/connexion"
              className="text-[10px] uppercase tracking-[0.2em] font-bold bg-accent text-bg rounded-md px-5 py-2.5 hover:brightness-110 transition-all"
            >
              Espace élève →
            </Link>
          )}
        </div>

        <button className="md:hidden text-text" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-bg px-6 py-6 flex flex-col gap-5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-text-dim hover:text-text"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={user ? "/espace-eleve" : "/connexion"}
            onClick={() => setOpen(false)}
            className="text-xs uppercase tracking-[0.2em] font-bold text-accent"
          >
            Espace élève →
          </Link>
        </div>
      )}
    </header>
  );
}
