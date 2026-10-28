import { useMemo, useState } from 'react';
import { Check, ChevronDown, RotateCcw, X } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * Mini-quiz optionnel (état local uniquement).
 */
export function FormationQuiz({ quiz, formationId }) {
  const questions = quiz?.questions || [];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const total = questions.length;

  const progressPct = useMemo(() => {
    if (!total) return 0;
    if (finished) return 100;
    return Math.round(((index + (revealed ? 1 : 0)) / total) * 100);
  }, [finished, index, revealed, total]);

  if (!quiz || !total) return null;

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  };

  const onChoose = (choiceIndex) => {
    if (revealed) return;
    setSelected(choiceIndex);
    setRevealed(true);
    if (choiceIndex === current.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const onNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div
      className="mt-12 border border-prestige-beige"
      data-testid={`formation-quiz-${formationId || 'x'}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 bg-zinc-50 px-5 py-5 text-left transition-colors hover:bg-zinc-100/80 md:px-6"
        aria-expanded={open}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe">
            Optionnel · {total} questions
          </p>
          <p className="mt-1 font-heading text-lg font-bold text-dark">
            {quiz.title || 'Testez vos connaissances'}
          </p>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-prestige-beige bg-white">
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open ? (
        <div className="border-t border-prestige-beige bg-white px-5 py-6 md:px-6">
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-[11px] font-medium text-slate-500">
              <span>
                {finished
                  ? `Résultat : ${score}/${total}`
                  : `Question ${Math.min(index + 1, total)} / ${total}`}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1 overflow-hidden bg-zinc-100">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {finished ? (
            <div className="space-y-5">
              <div>
                <p className="font-heading text-2xl font-bold text-dark">
                  {score === total
                    ? 'Excellent — tout est bon.'
                    : score >= Math.ceil(total * 0.66)
                      ? 'Solide — une courte revue suffit.'
                      : 'Relisez la capsule, puis réessayez.'}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Score :{' '}
                  <span className="font-semibold text-dark">
                    {score}/{total}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-[44px] items-center gap-2 border border-dark px-5 text-sm font-semibold text-dark transition-colors hover:bg-dark hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Recommencer
              </button>
            </div>
          ) : current ? (
            <div className="space-y-5">
              <p className="font-heading text-xl font-semibold leading-snug text-dark">
                {current.prompt}
              </p>
              <ul className="space-y-2.5">
                {current.choices.map((choice, choiceIndex) => {
                  const isCorrect = choiceIndex === current.correctIndex;
                  const isSelected = selected === choiceIndex;
                  let row =
                    'border-prestige-beige bg-white hover:border-dark';
                  let badge = 'border-prestige-beige text-slate-500';
                  if (revealed && isCorrect) {
                    row = 'border-primary bg-light/50';
                    badge = 'border-primary bg-primary text-white';
                  } else if (revealed && isSelected && !isCorrect) {
                    row = 'border-red-200 bg-red-50/60';
                    badge = 'border-red-300 bg-red-500 text-white';
                  }

                  return (
                    <li key={`${current.id}-${choiceIndex}`}>
                      <button
                        type="button"
                        disabled={revealed}
                        onClick={() => onChoose(choiceIndex)}
                        className={`flex w-full items-start gap-3 border px-4 py-3.5 text-left transition-colors disabled:cursor-default ${row}`}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] font-bold ${badge}`}
                        >
                          {revealed && isCorrect ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : revealed && isSelected && !isCorrect ? (
                            <X className="h-3.5 w-3.5" />
                          ) : (
                            LETTERS[choiceIndex] || choiceIndex + 1
                          )}
                        </span>
                        <span className="text-[15px] leading-relaxed text-dark">{choice}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {revealed ? (
                <div className="space-y-4 border-t border-prestige-beige pt-5">
                  <p className="text-sm leading-relaxed text-slate-700">
                    <span
                      className={`font-semibold ${
                        selected === current.correctIndex ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {selected === current.correctIndex ? 'Bonne réponse. ' : 'Pas tout à fait — '}
                    </span>
                    {current.explanation}
                  </p>
                  <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex min-h-[44px] items-center justify-center bg-dark px-6 text-sm font-semibold text-white transition-colors hover:bg-primary"
                  >
                    {index + 1 >= total ? 'Voir mon score' : 'Question suivante'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
