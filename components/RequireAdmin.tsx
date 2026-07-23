"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/connexion");
    }
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <div className="w-5 h-5 border border-border-strong border-t-accent rounded-full animate-spin" />
        <p className="text-text-faint font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Vérification des droits...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
