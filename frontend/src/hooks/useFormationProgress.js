import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'poc-formation-progress';

function readStore() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

/** Progression locale des modules Apprendre (sans compte requis). */
export function useFormationProgress() {
  const [completed, setCompleted] = useState(() => readStore());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setCompleted(readStore());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isComplete = useCallback(
    (lessonId) => Boolean(completed[lessonId]),
    [completed]
  );

  const markComplete = useCallback((lessonId) => {
    setCompleted((prev) => {
      if (prev[lessonId]) return prev;
      const next = { ...prev, [lessonId]: Date.now() };
      writeStore(next);
      return next;
    });
  }, []);

  const markIncomplete = useCallback((lessonId) => {
    setCompleted((prev) => {
      if (!prev[lessonId]) return prev;
      const next = { ...prev };
      delete next[lessonId];
      writeStore(next);
      return next;
    });
  }, []);

  const getCourseProgress = useCallback(
    (lessonIds = []) => {
      const total = lessonIds.length;
      const done = lessonIds.filter((id) => completed[id]).length;
      const percent = total ? Math.round((done / total) * 100) : 0;
      const nextId = lessonIds.find((id) => !completed[id]) || null;
      return { done, total, percent, nextId, isFinished: total > 0 && done === total };
    },
    [completed]
  );

  return { isComplete, markComplete, markIncomplete, getCourseProgress };
}
