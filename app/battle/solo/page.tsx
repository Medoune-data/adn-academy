"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { doc, updateDoc, increment } from "firebase/firestore";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { FORMATIONS } from "@/lib/formations";
import { BattleQuestion } from "@/lib/groq";
import { computeAnswerXp, getBadgeForXp } from "@/lib/xp";

const QUESTION_TIME_MS = 20000;
const DIFFICULTIES = ["Débutant", "Intermédiaire", "Avancé"];

type Phase = "setup" | "loading" | "playing" | "finished";

interface AnswerRecord {
  question: BattleQuestion;
  chosenIndex: number | null;
  correct: boolean;
  xpGained: number;
}

function SoloBattle() {
  const { user, profile } = useAuth();
  const [phase, setPhase] = useState<Phase>("setup");
  const [formationSlug, setFormationSlug] = useState(FORMATIONS[0].slug);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_MS);
  const questionStartRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const xpSavedRef = useRef(false);

  const startGame = async () => {
    setError(null);
    setPhase("loading");
    try {
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/battle/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, formationSlug, difficulty }),
      });
      const data = await res.json();
      if (!res.ok || !data.questions?.length) {
        throw new Error(data.error || "Impossible de charger les questions");
      }
      setQuestions(data.questions);
      setAnswers([]);
      setCurrent(0);
      xpSavedRef.current = false;
      setPhase("playing");
    } catch (e) {
      console.error(e);
      setError("Impossible de démarrer la partie. Réessaie dans un instant.");
      setPhase("setup");
    }
  };

  // Chrono par question
  useEffect(() => {
    if (phase !== "playing") return;
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
  }, [phase, current]);

  const handleAnswer = (index: number | null) => {
    if (locked) return; // déjà répondu ou temps écoulé
    setLocked(true);
    setSelected(index);
    if (timerRef.current) clearInterval(timerRef.current);

    const q = questions[current];
    const elapsed = Date.now() - questionStartRef.current;
    const correct = index !== null && index === q.correctIndex;
    const xpGained = computeAnswerXp(correct, elapsed, QUESTION_TIME_MS);

    setAnswers((prev) => [...prev, { question: q, chosenIndex: index, correct, xpGained }]);

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
      } else {
        setPhase("finished");
      }
    }, 1200);
  };

  // Sauvegarde XP à la fin
  useEffect(() => {
    if (phase !== "finished" || xpSavedRef.current || !user) return;
    xpSavedRef.current = true;
    const totalXp = answers.reduce((sum, a) => sum + a.xpGained, 0);
    if (totalXp > 0) {
      updateDoc(doc(db, "students", user.uid), { xp: increment(totalXp) }).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const score = answers.filter((a) => a.correct).length;
  const totalXpGained = answers.reduce((sum, a) => sum + a.xpGained, 0);
  const projectedXp = (profile?.xp ?? 0) + totalXpGained;
  const badge = getBadgeForXp(projectedXp);

  if (phase === "setup") {
    return (
      <main className="pt-40 pb-24 px-6 min-h-screen">
        <div className="max-w-lg mx-auto">
          <Link href="/battle" className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold mb-8 inline-block">
            ← ADN Battle
          </Link>
          <p className="cell-label mb-4">Solo vs IA</p>
          <h1 className="font-display italic text-3xl md:text-4xl text-text mb-10">
            Choisis ton défi
          </h1>

          <div className="space-y-6 mb-10">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-3 block">
                Formation
              </label>
              <div className="flex flex-wrap gap-2">
                {FORMATIONS.map((f) => (
                  <button
                    key={f.slug}
                    onClick={() => setFormationSlug(f.slug)}
                    className={`text-xs font-mono uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all ${
                      formationSlug === f.slug
                        ? "bg-accent text-bg border-accent"
                        : "border-border-strong text-text-dim hover:border-accent/50"
                    }`}
                  >
                    {f.title.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-faint font-mono mb-3 block">
                Niveau
              </label>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`text-xs font-mono uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all ${
                      difficulty === d
                        ? "bg-accent text-bg border-accent"
                        : "border-border-strong text-text-dim hover:border-accent/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-light mb-6">{error}</p>}

          <button
            onClick={startGame}
            className="w-full bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-full hover:brightness-105 transition-all"
          >
            Commencer →
          </button>
        </div>
      </main>
    );
  }

  if (phase === "loading") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 border border-border-strong border-t-accent rounded-full animate-spin" />
        <p className="text-text-faint font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Génération des questions...
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
              Question {current + 1} / {questions.length}
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

          <h2 className="font-display italic text-2xl text-text mb-10 leading-snug">
            {q.question}
          </h2>

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

  // finished
  return (
    <main className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <p className="cell-label mb-4 justify-center flex">Résultat</p>
        <h1 className="font-display italic text-4xl md:text-5xl text-text mb-8">
          {score} / {questions.length} bonnes réponses
        </h1>

        <div className="flex items-center justify-center gap-8 mb-14">
          <div>
            <p className="text-3xl">{badge.icon}</p>
            <p className="text-text-dim text-xs font-mono mt-1">{badge.label}</p>
          </div>
          <div>
            <p className="font-display italic text-2xl text-accent">+{totalXpGained}</p>
            <p className="text-text-dim text-xs font-mono mt-1">XP gagné</p>
          </div>
        </div>

        <div className="space-y-4 text-left mb-12">
          {answers.map((a, i) => (
            <div key={i} className="border border-border rounded-2xl p-6 bg-surface">
              <p className="text-text font-medium text-sm mb-2">{a.question.question}</p>
              <p className={`text-xs font-mono mb-2 ${a.correct ? "text-accent" : "text-red-500"}`}>
                {a.correct ? "✓ Correct" : `✗ Réponse : ${a.question.options[a.question.correctIndex]}`}
              </p>
              <p className="text-text-dim text-xs font-light italic">{a.question.explanation}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setPhase("setup")}
            className="bg-accent text-bg font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:brightness-105 transition-all"
          >
            Rejouer →
          </button>
          <Link
            href="/battle"
            className="border border-border-strong text-text font-mono text-xs uppercase tracking-[0.2em] font-bold px-7 py-4 rounded-full hover:border-accent/60 transition-all"
          >
            Retour à ADN Battle
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SoloBattlePage() {
  return (
    <RequireAuth>
      <SoloBattle />
    </RequireAuth>
  );
}
