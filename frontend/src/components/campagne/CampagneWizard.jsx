import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

/**
 * Hook wizard commun pour les outils campagne (mobile immersive).
 * `stepIds` peut changer (branchements) — l’index reste borné.
 */
export function useCampagneWizard(stepIds, { onReachResult } = {}) {
  const [stepIndex, setStepIndex] = useState(0);
  const advanceTimerRef = useRef(null);
  const resultTrackedRef = useRef(false);
  const onReachResultRef = useRef(onReachResult);
  onReachResultRef.current = onReachResult;

  const safeIds = useMemo(
    () => (stepIds?.length ? stepIds : ['result']),
    [stepIds]
  );
  const clampedIndex = Math.min(stepIndex, safeIds.length - 1);
  const currentStepId = safeIds[clampedIndex];
  const isResult = currentStepId === 'result';
  const questionSteps = useMemo(
    () => safeIds.filter((id) => id !== 'result'),
    [safeIds]
  );
  const progress = isResult
    ? 100
    : Math.round(((clampedIndex + 1) / Math.max(1, questionSteps.length)) * 100);

  useEffect(
    () => () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    },
    []
  );

  const markResult = useCallback(() => {
    if (resultTrackedRef.current) return;
    resultTrackedRef.current = true;
    onReachResultRef.current?.();
  }, []);

  const goToIndex = useCallback(
    (nextIdx, ids = safeIds) => {
      const idx = Math.min(Math.max(0, nextIdx), ids.length - 1);
      if (ids[idx] === 'result') markResult();
      setStepIndex(idx);
    },
    [safeIds, markResult]
  );

  const advanceFrom = useCallback(
    (fromStepId, nextIds = safeIds) => {
      const fromIdx = nextIds.indexOf(fromStepId);
      const nextIdx = Math.min(fromIdx + 1, nextIds.length - 1);
      goToIndex(nextIdx, nextIds);
    },
    [safeIds, goToIndex]
  );

  const selectAndAdvance = useCallback(
    (fromStepId, apply, { delay = 220, nextIds } = {}) => {
      const ids = nextIds || safeIds;
      apply?.();
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = setTimeout(() => {
        advanceFrom(fromStepId, ids);
      }, delay);
    },
    [safeIds, advanceFrom]
  );

  const goBack = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const restart = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setStepIndex(0);
    resultTrackedRef.current = false;
  }, []);

  return {
    stepIndex: clampedIndex,
    currentStepId,
    isResult,
    questionSteps,
    progress,
    questionCount: questionSteps.length,
    advanceFrom,
    selectAndAdvance,
    goBack,
    goToIndex,
    restart,
    setStepIndex,
  };
}

export function WizardProgress({
  stepIndex,
  questionCount,
  isResult,
  resultLabel = 'Résultat',
  progress,
}) {
  const label = isResult
    ? resultLabel
    : `Question ${stepIndex + 1} / ${questionCount}`;
  const pct = progress ?? (isResult ? 100 : Math.round(((stepIndex + 1) / Math.max(1, questionCount)) * 100));

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
        <p className="text-xs text-prestige-taupe">{pct} %</p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-prestige-beige/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-400 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function WizardBackButton({ onClick, testId = 'campagne-wizard-back' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-prestige-taupe transition-colors hover:text-primary"
      data-testid={testId}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Retour
    </button>
  );
}

export function WizardChoiceButton({
  selected,
  onClick,
  label,
  hint,
  testId,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-testid={testId}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors ${
        selected
          ? 'bg-gradient-to-br from-primary/[0.08] to-secondary/[0.1] shadow-[inset_0_0_0_2px_rgba(6,77,217,0.35)]'
          : 'bg-white shadow-[inset_0_0_0_1px_rgba(1,35,63,0.1)] hover:shadow-[inset_0_0_0_1px_rgba(6,77,217,0.35)]'
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-dark sm:text-base">{label}</span>
        {hint ? (
          <span className="mt-0.5 block text-xs text-prestige-taupe">{hint}</span>
        ) : null}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          selected ? 'bg-primary text-white' : 'bg-prestige-beige/60 text-transparent'
        }`}
        aria-hidden
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    </button>
  );
}

export function WizardChoiceList({ options, value, onSelect, name }) {
  return (
    <div className="space-y-2.5" role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <WizardChoiceButton
          key={String(opt.value)}
          selected={value === opt.value}
          onClick={() => onSelect(opt.value)}
          label={opt.label}
          hint={opt.hint}
          testId={opt.testId || (name ? `wizard-choice-${name}-${opt.value}` : undefined)}
        />
      ))}
    </div>
  );
}

export function WizardContinueButton({
  onClick,
  disabled = false,
  label = 'Continuer',
  testId = 'campagne-wizard-continue',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </button>
  );
}

export function WizardStep({ id, children }) {
  return (
    <div key={id} className="campagne-climax-enter space-y-5" data-testid={`wizard-step-${id}`}>
      {children}
    </div>
  );
}

export function WizardStepHeading({ title, hint }) {
  return (
    <div>
      <h3 className="font-heading text-xl font-bold leading-snug text-dark sm:text-2xl">{title}</h3>
      {hint ? (
        <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{hint}</p>
      ) : null}
    </div>
  );
}
