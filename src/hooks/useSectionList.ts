"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";

type IdItem = {
  id: string;
};

type ValidateFn<TItem, TErrors> = (item: TItem) => TErrors;

export function useSectionList<
  TItem extends IdItem,
  TErrors extends Record<string, string | undefined>,
>(params: {
  storageKey: string;
  initialValue?: TItem[];
  validateItem: ValidateFn<TItem, TErrors>;
  createItem: () => TItem;
  debounceMs?: number;
}) {
  const {
    storageKey,
    initialValue = [],
    validateItem,
    createItem,
    debounceMs = 250,
  } = params;

  const [storedItems, setStoredItems] = useLocalStorage<TItem[]>(
    storageKey,
    initialValue,
  );

  const didInitRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);

  const [items, setItems] = useState<TItem[]>(() => storedItems);
  const [errors, setErrors] = useState<Record<string, TErrors>>({});

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevPositionsRef = useRef<Record<string, DOMRect>>({});
  const shouldAnimateRef = useRef(false);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      setStoredItems(items);
    }, debounceMs);
  }, [items, debounceMs, setStoredItems]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [items, setStoredItems, debounceMs]);

  const addItem = () => {
    setItems((prev) => [...prev, createItem()]);
  };

  const updateItem = (id: string, patch: Partial<Omit<TItem, "id">>) => {
    setItems((prev) => {
      const current = prev.find((i) => i.id === id);
      if (!current) return prev;

      const updated = { ...current, ...patch } as TItem;
      const nextItems = prev.map((i) => (i.id === id ? updated : i));

      setErrors((prevErrs) => {
        if (!prevErrs[id]) return prevErrs;
        const nextErrs = { ...prevErrs };
        const nextItemErrs = validateItem(updated);
        if (Object.keys(nextItemErrs).length === 0) {
          delete nextErrs[id];
        } else {
          nextErrs[id] = nextItemErrs;
        }
        return nextErrs;
      });

      return nextItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;

      const positions: Record<string, DOMRect> = {};
      for (const item of prev) {
        const el = cardRefs.current[item.id];
        if (el) positions[item.id] = el.getBoundingClientRect();
      }
      prevPositionsRef.current = positions;
      shouldAnimateRef.current = true;

      const next = [...prev];
      const tmp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = tmp;
      return next;
    });
  };

  useLayoutEffect(() => {
    if (!shouldAnimateRef.current) return;
    shouldAnimateRef.current = false;

    const prevPositions = prevPositionsRef.current;
    const animations: Array<() => void> = [];

    for (const item of items) {
      const el = cardRefs.current[item.id];
      const prevRect = prevPositions[item.id];
      if (!el || !prevRect) continue;

      const nextRect = el.getBoundingClientRect();
      const dx = prevRect.left - nextRect.left;
      const dy = prevRect.top - nextRect.top;
      if (dx === 0 && dy === 0) continue;

      animations.push(() => {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = "transform 0s";
        requestAnimationFrame(() => {
          el.style.transition = "transform 200ms ease";
          el.style.transform = "translate(0px, 0px)";
        });

        const cleanup = () => {
          el.removeEventListener("transitionend", cleanup);
          el.style.transition = "";
          el.style.transform = "";
        };
        el.addEventListener("transitionend", cleanup);
      });
    }

    for (const run of animations) run();
  }, [items]);

  const setCardRef = (id: string) => (el: HTMLDivElement | null) => {
    cardRefs.current[id] = el;
  };

  const validateAll = () => {
    const nextErrors: Record<string, TErrors> = {};
    for (const item of items) {
      const errs = validateItem(item);
      if (Object.keys(errs).length > 0) {
        nextErrors[item.id] = errs;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return {
    items,
    errors,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    setCardRef,
    validateAll,
    setItems,
    setErrors,
  };
}
