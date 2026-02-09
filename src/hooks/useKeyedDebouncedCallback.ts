"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Key = string | number | symbol;

export function useKeyedDebouncedCallback<TKey extends Key, TValue>(
  callback: (key: TKey, value: TValue) => void | Promise<void>,
  delayMs: number = 1000,
) {
  const callbackRef = useRef(callback);
  const timersRef = useRef(new Map<TKey, number>());
  const pendingValuesRef = useRef(new Map<TKey, TValue>());

  const inFlightCountRef = useRef(0);
  const [, setInFlightCount] = useState(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const setInFlightDelta = useCallback((delta: number) => {
    inFlightCountRef.current += delta;
    setInFlightCount(inFlightCountRef.current);
  }, []);

  const getIsInFlight = useCallback(() => inFlightCountRef.current > 0, []);

  const clearAllTimersAndPending = useCallback(() => {
    for (const t of timersRef.current.values()) {
      window.clearTimeout(t);
    }
    timersRef.current.clear();
    pendingValuesRef.current.clear();
  }, []);

  const cancel = useCallback(
    (key?: TKey) => {
      if (key !== undefined) {
        const t = timersRef.current.get(key);
        if (t) window.clearTimeout(t);
        timersRef.current.delete(key);
        pendingValuesRef.current.delete(key);
        return;
      }

      clearAllTimersAndPending();
    },
    [clearAllTimersAndPending],
  );

  const runOne = useCallback(
    async (key: TKey, value: TValue) => {
      setInFlightDelta(1);
      try {
        await callbackRef.current(key, value);
      } finally {
        setInFlightDelta(-1);
      }
    },
    [setInFlightDelta],
  );

  const runDebounced = useCallback(
    (key: TKey, value: TValue) => {
      pendingValuesRef.current.set(key, value);

      const existing = timersRef.current.get(key);
      if (existing) window.clearTimeout(existing);

      const timer = window.setTimeout(() => {
        pendingValuesRef.current.delete(key);
        timersRef.current.delete(key);
        void runOne(key, value);
      }, delayMs);

      timersRef.current.set(key, timer);
    },
    [delayMs, runOne],
  );

  const schedule = useCallback(
    (key: TKey, value: TValue) => {
      runDebounced(key, value);
    },
    [runDebounced],
  );

  const flush = useCallback(async () => {
    const entries = Array.from(pendingValuesRef.current.entries());
    clearAllTimersAndPending();

    for (const [key, value] of entries) {
      await runOne(key, value);
    }
  }, [clearAllTimersAndPending, runOne]);

  useEffect(() => {
    const timers = timersRef.current;
    const pendingValues = pendingValuesRef.current;
    return () => {
      for (const t of timers.values()) {
        window.clearTimeout(t);
      }
      timers.clear();
      pendingValues.clear();
    };
  }, []);

  return useMemo(
    () => ({ schedule, flush, cancel, getIsInFlight }),
    [cancel, flush, getIsInFlight, schedule],
  );
}
