"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { BattleQuestion } from "@/lib/groq";
import { getCurrentWeekId } from "@/lib/week";

const QUESTION_TIME_MS = 20000;

type Phase = "loading" | "playing" | "finished";

interface LeaderboardEntry {
  id: string;
  studentName: string;
  score: number;
  timeMs: number;
}

function HebdoBattle() {
  const { user, profile } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_MS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const weekId = getCurrentWeekId();
  const questionStartRef = useRef<number>(0);
  const gameStartRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimeRef = useRef(0);

  useEffect(() => {
    const load = async () => {
      try {
        const idToken = await user!.getIdToken();
        const res = await fetch("/api/battle/weekly", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (!res.ok || !data.questions?.length) throw new Error(data.error);
        setQuestions(data.questions);
        gameStartRef.current = Date.now();
        setPhase("playing");
      } catch (e) {
        console.error(e);
        setError("Impossible de charger le défi de la semaine. Réessaie dans un instant.");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "battle_weekly_scores", weekId, "entries"),
      orderBy("score", "desc"),
      limit(10)
    );
    const unsub = onSnapshot(q, (snap) => {
      setLeaderboard(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeaderboardEntry)));
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId]);

  useEffect(() => {
    if (phase !== "playing" || questions.length === 0) return;
    questionStartRef.current = Date.now();
    setTimeLeft(QUESTION_TIME_MS);
    setSelected(null);
    setLocked(false);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - questionStartRef.current;
      const remaining = QUESTION_TIME_MS - elapsed;
      if (remaining <= 0) {
        setTimeLeft(0);
        if (timerRef.current) clearInterval(timerRef.current);
        handleAnswer(null);
      } else {
        setTimeLeft(remaining);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current, questions.length]);

  const handleAnswer = (index: number | null) => {
    if (locked) return;
    setLocked(true);
    setSelected(index);
    if (timerRef.current) clearInterval(timerRef.current);

    const q = questions[current];
    const correct = index !== null && index === q.correctIndex;
    if (correct) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
      } else {
        totalTimeRef.current = Date.now() - gameStartRef.current;
        setPhase("finished");
      }
    }, 1200);
  };

  useEffect(() => {
    if (phase !== "finished" || submitted || !user) return;
    setSubmitted(true);
    const submit = async () => {
      const idToken = await user.getIdToken();
      await fetch("/api/battle/weekly-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          score: correctCount * 20,
          timeMs: totalTimeRef.current,
          studentName: profile?.name || user.displayName || "Élève ADN",
        }),
      }).catch(console.error);
    };
    submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (error) {
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen text-center">
        <p className="text-text-dim mb-6">{error}</p>
        <Link href="/battle" className="text-accent text-xs uppercase tracking-widest font-bold hover:underline">
          ← Retour à ADN Battle
        </Link>
      </main>
    );
  }

  if (phase === "loading") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 border border-border-strong border-t-accent rounded-full animate-spin" />
        <p className="text-text-faint font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Chargement du défi de la semaine...
        </p>
      </main>
    );
  }

  if (phase === "playing") {
    const q = questions[current];
    const progress = ((current + 1) / questions.length) * 100;
    const timeRatio = timeLeft / QUESTION_TIME_MS;

    return (
      <main className="pt-32 pb-24 px-6 min-h-screen">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-text-faint uppercase tracking-widest">
              🔥 Défi {weekId} · {current + 1} / {questions.length}
            </span>
            <span className={`font-mono text-xs font-bold ${timeRatio < 0.3 ? "text-red-500" : "text-accent"}`}>
              {Math.ceil(timeLeft / 1000)}s
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

          <h2 className="font-display italic text-2xl text-text mb-10 leading-snug">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correctIndex;
              const showResult = locked;
              let stateClass = "border-border-strong hover:border-accent/50";
              if (showResult && isCorrect) stateClass = "border-accent bg-accent-dim";
              else if (showResult && isSelected && !isCorrect) stateClass = "border-red-400 bg-red-50";

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={locked}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${stateClass} disabled:cursor-default`}
                >
                  <span className="text-text font-medium text-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          {locked && (
            <p className="text-text-dim text-sm font-light mt-6 italic">{q.explanation}</p>
          )}
        </div>
      </main>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <p className="cell-label mb-4 justify-center flex">Défi {weekId} — Terminé</p>
        <h1 className="font-display italic text-4xl md:text-5xl text-text mb-14">
          {correctCount} / {questions.length} bonnes réponses
        </h1>

        <p className="cell-label mb-6">🔥 Classement de la semaine</p>
        <div className="space-y-3 mb-14 text-left">
          {leaderboard.length === 0 ? (
            <p className="text-text-dim font-light text-center">Sois le premier à apparaître ici !</p>
          ) : (
            leaderboard.map((entry, i) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  entry.id === user?.uid ? "border-accent/50 bg-accent-dim" : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm w-6">{medals[i] ?? `#${i + 1}`}</span>
                  <span className="text-text text-sm font-medium">{entry.studentName}</span>
                </div>
                <span className="font-mono text-xs text-text-dim">{entry.score} pts</span>
              </div>
            ))
          )}
        </div>

        <Link
          href="/battle"
          className="inline-block border border-border-strong text-text font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:border-accent/60 transition-all"
        >
          Retour à ADN Battle
        </Link>
      </div>
    </main>
  );
}

export default function HebdoBattlePage() {
  return (
    <RequireAuth>
      <HebdoBattle />
    </RequireAuth>
  );
}
