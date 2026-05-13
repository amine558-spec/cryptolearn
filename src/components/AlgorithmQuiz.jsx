import { useState } from "react";
import { saveScore } from "../lib/progress";
import { CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AlgorithmQuiz({ questions, algorithmName, algorithmId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]); // {correct: bool}
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const isCorrect = selected === current?.correct;
  const score = answers.filter((a) => a.correct).length;

  function handleSelect(index) {
    if (confirmed) return;
    setSelected(index);
  }

  function handleConfirm() {
    if (selected === null) return;
    setConfirmed(true);
    setAnswers((prev) => [...prev, { correct: selected === current.correct }]);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      const finalScore = answers.filter(a => a.correct).length + (selected === current.correct ? 1 : 0);
      if (algorithmId) saveScore(algorithmId, finalScore, questions.length);
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  function handleReset() {
    setCurrentIndex(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers([]);
    setFinished(false);
  }

  const scorePercent = Math.round((score / questions.length) * 100);
  const scoreLabel = scorePercent === 100
    ? "Parfait ! Excellent travail 🎉"
    : scorePercent >= 75
    ? "Très bien ! Vous maîtrisez bien ce sujet."
    : scorePercent >= 50
    ? "Pas mal ! Quelques révisions s'imposent."
    : "Continuez à étudier, vous progresserez !";

  if (finished) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-foreground">Résultats du Quiz</h3>
        </div>

        <div className="text-center py-6">
          <div className={cn(
            "inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold mb-4",
            scorePercent === 100 ? "bg-green-100 text-green-600" :
            scorePercent >= 75 ? "bg-blue-100 text-blue-600" :
            scorePercent >= 50 ? "bg-amber-100 text-amber-600" :
            "bg-red-100 text-red-600"
          )}>
            {score}/{questions.length}
          </div>
          <p className="text-lg font-semibold text-foreground mb-1">{scoreLabel}</p>
          <p className="text-sm text-muted-foreground">{scorePercent}% de bonnes réponses</p>
        </div>

        {/* Answer recap */}
        <div className="space-y-2 mb-6">
          {questions.map((q, i) => (
            <div key={q.id} className={cn(
              "flex items-center gap-3 p-3 rounded-lg text-sm",
              answers[i]?.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            )}>
              {answers[i]?.correct
                ? <CheckCircle className="h-4 w-4 shrink-0" />
                : <XCircle className="h-4 w-4 shrink-0" />
              }
              <span className="line-clamp-1">{q.question}</span>
            </div>
          ))}
        </div>

        <Button onClick={handleReset} variant="outline" className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          Recommencer le quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">?</span>
          Quiz — {algorithmName}
        </h3>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-6">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + (confirmed ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">{current.question}</p>

      {/* Options */}
      <div className="space-y-2 mb-5">
        {current.options.map((option, i) => {
          let style = "border-border bg-muted/30 text-foreground hover:border-primary/40 hover:bg-primary/5";
          if (confirmed) {
            if (i === current.correct) style = "border-green-400 bg-green-50 text-green-700";
            else if (i === selected && i !== current.correct) style = "border-red-400 bg-red-50 text-red-700";
            else style = "border-border bg-muted/20 text-muted-foreground opacity-60";
          } else if (selected === i) {
            style = "border-primary bg-primary/10 text-foreground";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={confirmed}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 flex items-center gap-3",
                style,
                !confirmed && "cursor-pointer"
              )}
            >
              <span className={cn(
                "h-6 w-6 rounded-full border-2 text-xs font-bold flex items-center justify-center shrink-0",
                confirmed && i === current.correct ? "border-green-500 text-green-600" :
                confirmed && i === selected && i !== current.correct ? "border-red-500 text-red-600" :
                selected === i ? "border-primary text-primary" :
                "border-muted-foreground/40 text-muted-foreground"
              )}>
                {String.fromCharCode(65 + i)}
              </span>
              {option}
              {confirmed && i === current.correct && <CheckCircle className="h-4 w-4 text-green-500 ml-auto shrink-0" />}
              {confirmed && i === selected && i !== current.correct && <XCircle className="h-4 w-4 text-red-500 ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {confirmed && (
        <div className={cn(
          "rounded-lg p-4 text-sm mb-5 flex items-start gap-3",
          isCorrect ? "bg-green-50 text-green-800 border border-green-200" : "bg-amber-50 text-amber-800 border border-amber-200"
        )}>
          <span className="text-base shrink-0">{isCorrect ? "✅" : "💡"}</span>
          <p className="leading-relaxed">{current.explanation}</p>
        </div>
      )}

      {/* Actions */}
      {!confirmed ? (
        <Button onClick={handleConfirm} disabled={selected === null} className="w-full">
          Valider ma réponse
        </Button>
      ) : (
        <Button onClick={handleNext} className="w-full gap-2">
          {currentIndex + 1 >= questions.length ? (
            <><Trophy className="h-4 w-4" /> Voir mes résultats</>
          ) : (
            <>Question suivante <ChevronRight className="h-4 w-4" /></>
          )}
        </Button>
      )}
    </div>
  );
}