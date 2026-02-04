"use client";

import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type React from "react";
import { createPortal } from "react-dom";
import styles from "./select.module.scss";

export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      value,
      options,
      onChange,
      disabled = false,
      className = "",
      name,
      id,
    },
    ref,
  ) => {
    const reactId = useId();
    const controlId = id ?? reactId;
    const listboxId = `${controlId}-listbox`;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [dropdownRect, setDropdownRect] = useState<{
      top: number;
      left: number;
      width: number;
    } | null>(null);

    const selectedIndex = useMemo(() => {
      return options.findIndex((o) => o.value === value);
    }, [options, value]);

    const selectedLabel = useMemo(() => {
      return options[selectedIndex]?.label ?? "";
    }, [options, selectedIndex]);

    useEffect(() => {
      if (!isOpen) return;

      const updateRect = () => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setDropdownRect({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
        });
      };

      updateRect();

      const onPointerDown = (e: MouseEvent) => {
        const target = e.target as Node | null;
        if (!target) return;
        if (
          !wrapperRef.current?.contains(target) &&
          !listRef.current?.contains(target)
        ) {
          setIsOpen(false);
        }
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };

      const onReposition = () => {
        updateRect();
      };

      document.addEventListener("mousedown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("resize", onReposition);
      window.addEventListener("scroll", onReposition, true);
      return () => {
        document.removeEventListener("mousedown", onPointerDown);
        document.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("resize", onReposition);
        window.removeEventListener("scroll", onReposition, true);
      };
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return;
      const nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
      setActiveIndex(nextIndex);
      queueMicrotask(() => {
        const el = listRef.current?.querySelector<HTMLElement>(
          `[data-option-index="${nextIndex}"]`,
        );
        el?.focus();
      });
    }, [isOpen, selectedIndex]);

    const selectIndex = (index: number) => {
      const opt = options[index];
      if (!opt) return;
      onChange(opt.value);
      setIsOpen(false);
    };

    const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };

    const onOptionKeyDown = (
      e: React.KeyboardEvent<HTMLButtonElement>,
      index: number,
    ) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(options.length - 1, index + 1);
        setActiveIndex(next);
        const el = listRef.current?.querySelector<HTMLElement>(
          `[data-option-index="${next}"]`,
        );
        el?.focus();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.max(0, index - 1);
        setActiveIndex(next);
        const el = listRef.current?.querySelector<HTMLElement>(
          `[data-option-index="${next}"]`,
        );
        el?.focus();
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
        const el = listRef.current?.querySelector<HTMLElement>(
          `[data-option-index="0"]`,
        );
        el?.focus();
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        const next = options.length - 1;
        setActiveIndex(next);
        const el = listRef.current?.querySelector<HTMLElement>(
          `[data-option-index="${next}"]`,
        );
        el?.focus();
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectIndex(index);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        queueMicrotask(() => {
          triggerRef.current?.focus();
        });
      }
    };

    return (
      <div
        ref={wrapperRef}
        className={`${styles.selectField} ${isOpen ? styles.fieldOpen : ""} ${className}`}
      >
        {label && (
          <label className={styles.selectLabel} htmlFor={controlId}>
            {label}
          </label>
        )}

        {name ? <input type="hidden" name={name} value={value} /> : null}

        <button
          id={controlId}
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
          onClick={() => {
            if (disabled) return;
            setIsOpen((v) => !v);
          }}
          onKeyDown={onTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          disabled={disabled}
        >
          <span className={styles.value}>{selectedLabel}</span>
          <span className={styles.icon} aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isOpen && dropdownRect
          ? createPortal(
              <div
                ref={listRef}
                id={listboxId}
                role="listbox"
                className={styles.dropdown}
                aria-labelledby={controlId}
                style={{
                  top: dropdownRect.top,
                  left: dropdownRect.left,
                  width: dropdownRect.width,
                }}
              >
                {options.map((opt, index) => {
                  const isSelected = opt.value === value;
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`${styles.option} ${isSelected ? styles.optionSelected : ""} ${isActive ? styles.optionActive : ""}`}
                      onClick={() => selectIndex(index)}
                      onKeyDown={(e) => onOptionKeyDown(e, index)}
                      data-option-index={index}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>,
              document.body,
            )
          : null}
      </div>
    );
  },
);

Select.displayName = "Select";
