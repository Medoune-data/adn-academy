"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { collection, doc, onSnapshot, orderBy, query, getDocs } from "firebase/firestore";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";

interface RoomData {
  hostUid: string;
  formationTitle: string;
  difficulty: string;
  status: "waiting" | "playing" | "finished";
  startedAt: string | null;
  questionCount: number;
  questionTimeMs: number;
}

interface Player {
  id: string;
  name: string;
  score: number;
  isHost?: boolean;
}

interface PublicQuestion {
  question: string;
  options: string[];
}

interface AnswerResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
  xpGained: number;
}

function Room() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();

  const [room, setRoom] = useState<RoomData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const [now, setNow] = useState<number>(() => Date.now());
  const [answers, setAnswers] = useState<Record<number, AnswerResult>>({});
  const [selectedChoice, setSelectedChoice] = useState<{ index: number; choice: number | null } | null>(null);
  const submittingRef = useRef<Set<number>>(new Set());
  const finishCalledRef = useRef(false);

  // Écoute la salle en direct
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "battle_rooms", code),
      (snap) => {
        if (!snap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setRoom(snap.data() as RoomData);
        setLoading(false);
      },
      () => {
        setNotFound(true);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [code]);

  // Classement en direct
  useEffect(() => {
    const q = query(collection(db, "battle_rooms", code, "players"), orderBy("score", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Player)));
    });
    return () => unsub();
  }, [code]);

  // Charge les questions (sans les réponses) une fois la partie lancée
  useEffect(() => {
    if (room?.status !== "playing" && room?.status !== "finished") return;
    if (questions.length > 0) return;
    const load = async () => {
      const snap = await getDocs(collection(db, "battle_rooms", code, "questions_public"));
      const loaded: PublicQuestion[] = [];
      snap.forEach((d) => {
        loaded[Number(d.id)] = d.data() as PublicQuestion;
      });
      setQuestions(loaded);
    };
    load();
  }, [room?.status, code, questions.length]);

  // Horloge locale (dérive tout du startedAt commun, aucune dépendance à
  // une "diffusion" de la question courante)
  useEffect(() => {
    if (room?.status !== "playing") return;
    const interval = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(interval);
  }, [room?.status]);

  const questionTimeMs = room?.questionTimeMs || 20000;
  const startedAtMs = room?.startedAt ? new Date(room.startedAt).getTime() : 0;
  const elapsedTotal = room?.status === "playing" ? now - startedAtMs : 0;
  const currentIndex = room?.status === "playing" ? Math.floor(elapsedTotal / questionTimeMs) : -1;
  const timeLeftInSlot = questionTimeMs - (elapsedTotal % questionTimeMs);
  const gameOver = room?.status === "playing" && currentIndex >= (room?.questionCount ?? 0);

  // Signale la fin de partie une fois (n'importe quel joueur peut le faire)
  useEffect(() => {
    if (!gameOver || finishCalledRef.current || !user) return;
    finishCalledRef.current = true;
    user.getIdToken().then((idToken) => {
      fetch("/api/battle/room/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, code }),
      }).catch(console.error);
    });
  }, [gameOver, user, code]);

  // Le choix affiché se déduit directement au rendu : s'il appartient à
  // une question précédente, on l'ignore — pas besoin d'effet pour le
  // "réinitialiser" quand la question change.
  const selected = selectedChoice?.index === currentIndex ? selectedChoice.choice : null;

  const submitAnswer = async (index: number | null) => {
    if (currentIndex < 0 || answers[currentIndex] || submittingRef.current.has(currentIndex)) return;
    submittingRef.current.add(currentIndex);
    setSelectedChoice({ index: currentIndex, choice: index });
    try {
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/battle/room/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, code, questionIndex: currentIndex, chosenIndex: index }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnswers((prev) => ({ ...prev, [currentIndex]: data }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-verrouille localement quand le créneau se termine (sans réponse)
  useEffect(() => {
    if (room?.status !== "playing" || currentIndex < 0 || gameOver) return;
    if (timeLeftInSlot <= 250 && !answers[currentIndex] && !submittingRef.current.has(currentIndex)) {
      submitAnswer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeftInSlot, currentIndex, room?.status, gameOver]);

  const handleStart = async () => {
    setStarting(true);
    setError(null);
    try {
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/battle/room/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Impossible de démarrer.");
    } finally {
      setStarting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 border border-border-strong border-t-accent rounded-full animate-spin" />
        <p className="text-text-faint font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Connexion à la salle...
        </p>
      </main>
    );
  }

  if (notFound || !room) {
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen text-center">
        <p className="text-text-dim mb-6">Cette salle n&apos;existe pas ou plus.</p>
        <Link href="/battle/salle" className="text-accent text-xs uppercase tracking-widest font-bold hover:underline">
          ← Retour
        </Link>
      </main>
    );
  }

  const isHost = room.hostUid === user?.uid;

  // ─── LOBBY ────────────────────────────────────────────────────────
  if (room.status === "waiting") {
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen">
        <div className="max-w-lg mx-auto text-center">
          <p className="cell-label mb-4 justify-center flex">Salle d&apos;attente</p>
          <h1 className="font-display italic text-3xl md:text-4xl text-text mb-3">
            {room.formationTitle}
          </h1>
          <p className="text-text-dim text-sm font-light mb-10">{room.difficulty}</p>

          <button
            onClick={copyCode}
            className="inline-flex items-center gap-3 border border-accent/40 bg-accent-dim rounded-2xl px-8 py-5 mb-10 hover:brightness-105 transition-all"
          >
            <span className="font-mono text-3xl tracking-[0.3em] text-accent font-bold">{code}</span>
            <span className="text-[10px] uppercase tracking-widest text-text-faint">Copier</span>
          </button>

          <p className="cell-label mb-4">Joueurs ({players.length})</p>
          <div className="space-y-2 mb-12">
            {players.map((p) => (
              <div key={p.id} className="flex items-center justify-between border border-border rounded-xl p-4 bg-surface">
                <span className="text-text text-sm font-medium">{p.name}</span>
                {p.isHost && <span className="text-[10px] uppercase tracking-widest text-accent">Hôte</span>}
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm font-light mb-6">{error}</p>}

          {isHost ? (
            <button
              onClick={handleStart}
              disabled={starting || players.length < 2}
              className="w-full bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-full hover:brightness-105 transition-all disabled:opacity-50"
            >
              {players.length < 2
                ? "En attente d'un 2e joueur..."
                : starting
                ? "Démarrage..."
                : "Démarrer la partie →"}
            </button>
          ) : (
            <p className="text-text-faint font-mono text-xs uppercase tracking-widest animate-pulse">
              En attente que l&apos;hôte démarre...
            </p>
          )}
        </div>
      </main>
    );
  }

  // ─── PARTIE TERMINÉE : PODIUM ────────────────────────────────────
  if (room.status === "finished" || gameOver) {
    const medals = ["🥇", "🥈", "🥉"];
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen">
        <div className="max-w-lg mx-auto text-center">
          <p className="cell-label mb-4 justify-center flex">Partie terminée</p>
          <h1 className="font-display italic text-3xl md:text-4xl text-text mb-14">Classement final</h1>

          <div className="space-y-3 mb-12 text-left">
            {players.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  p.id === user?.uid ? "border-accent/50 bg-accent-dim" : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm w-6">{medals[i] ?? `#${i + 1}`}</span>
                  <span className="text-text text-sm font-medium">{p.name}</span>
                </div>
                <span className="font-mono text-xs text-text-dim">{p.score} pts</span>
              </div>
            ))}
          </div>

          <Link
            href="/battle/salle"
            className="inline-block bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:brightness-105 transition-all"
          >
            Nouvelle partie →
          </Link>
        </div>
      </main>
    );
  }

  // ─── EN JEU ──────────────────────────────────────────────────────
  const q = questions[currentIndex];
  const myAnswer = answers[currentIndex];
  const progress = ((currentIndex + 1) / room.questionCount) * 100;
  const timeRatio = timeLeftInSlot / questionTimeMs;

  return (
    <main className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_240px] gap-10">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-text-faint uppercase tracking-widest">
              Question {currentIndex + 1} / {room.questionCount}
            </span>
            <span className={`font-mono text-xs font-bold ${timeRatio < 0.3 ? "text-red-500" : "text-accent"}`}>
              {Math.ceil(timeLeftInSlot / 1000)}s
            </span>
          </div>
          <div className="h-1 bg-border rounded-full mb-2 overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="h-1 bg-border rounded-full mb-10 overflow-hidden">
            <div
              className={`h-full transition-all ${timeRatio < 0.3 ? "bg-red-500" : "bg-accent"}`}
              style={{ width: `${timeRatio * 100}%` }}
            />
          </div>

          {q ? (
            <>
              <h2 className="font-display italic text-2xl text-text mb-10 leading-snug">{q.question}</h2>
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const showResult = !!myAnswer;
                  const isSelected = selected === i;
                  const isCorrect = myAnswer && i === myAnswer.correctIndex;
                  let stateClass = "border-border-strong hover:border-accent/50";
                  if (showResult && isCorrect) stateClass = "border-accent bg-accent-dim";
                  else if (showResult && isSelected && !isCorrect) stateClass = "border-red-400 bg-red-50";

                  return (
                    <button
                      key={i}
                      onClick={() => submitAnswer(i)}
                      disabled={!!myAnswer}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${stateClass} disabled:cursor-default`}
                    >
                      <span className="text-text font-medium text-sm">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {myAnswer && (
                <div className="mt-6">
                  <p className="text-text-dim text-sm font-light italic mb-2">{myAnswer.explanation}</p>
                  <p className="text-text-faint text-xs font-mono uppercase tracking-widest">
                    En attente de la prochaine question...
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-text-faint font-mono text-xs uppercase tracking-widest animate-pulse">
              Chargement de la question...
            </p>
          )}
        </div>

        {/* Classement en direct */}
        <aside>
          <p className="cell-label mb-4">Classement en direct</p>
          <div className="space-y-2">
            {players.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm ${
                  p.id === user?.uid ? "border-accent/50 bg-accent-dim" : "border-border bg-surface"
                }`}
              >
                <span className="text-text font-medium truncate">
                  {i + 1}. {p.name}
                </span>
                <span className="font-mono text-xs text-text-dim flex-shrink-0 ml-2">{p.score}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function RoomPage() {
  return (
    <RequireAuth>
      <Room />
    </RequireAuth>
  );
}
