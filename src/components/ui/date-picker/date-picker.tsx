"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";

import styles from "./date-picker.module.scss";

export type DatePickerValue = {
  month: number;
  year: number;
};

export type DatePickerProps = {
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  value?: DatePickerValue;
  onChange?: (value: DatePickerValue | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
};

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonthYear(value: DatePickerValue | undefined) {
  if (!value) return "";
  const mm = String(value.month).padStart(2, "0");
  return `${mm}/${value.year}`;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className = "",
      label,
      required = false,
      error,
      fullWidth = false,
      value,
      onChange,
      placeholder = "MM/YYYY",
      disabled = false,
      name,
    },
    ref,
  ) => {
    const id = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [viewYear, setViewYear] = useState(
      () => value?.year ?? new Date().getFullYear(),
    );

    useEffect(() => {
      if (!isOpen) return;

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };

      const onPointerDown = (e: PointerEvent) => {
        const root = rootRef.current;
        if (!root) return;
        if (e.target instanceof Node && !root.contains(e.target)) {
          setIsOpen(false);
        }
      };

      window.addEventListener("keydown", onKeyDown);
      document.addEventListener("pointerdown", onPointerDown, true);

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("pointerdown", onPointerDown, true);
      };
    }, [isOpen]);

    const classNames = [
      styles.input,
      fullWidth ? styles.fullWidth : "",
      error ? styles.error : "",
      value ? styles.hasValue : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const formatted = formatMonthYear(value);

    const canChange = !disabled && Boolean(onChange);

    const selectMonth = (monthIndex: number) => {
      if (!canChange) return;
      onChange?.({ month: monthIndex + 1, year: viewYear });
      setIsOpen(false);
    };

    const clearValue = () => {
      if (!canChange) return;
      onChange?.(undefined);
    };

    return (
      <div className={styles.inputWrapper} ref={rootRef}>
        {label && (
          <span
            className={`${styles.label} ${required ? styles.required : ""}`}
          >
            {label}
          </span>
        )}

        <div className={styles.pickerRoot}>
          <input
            id={id}
            ref={ref}
            name={name}
            className={classNames}
            value={formatted}
            placeholder={placeholder}
            readOnly
            disabled={disabled}
            role="button"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onClick={() => {
              if (disabled) return;
              setIsOpen(true);
            }}
            onFocus={() => {
              if (disabled) return;
              setIsOpen(true);
            }}
          />

          {value && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              aria-label="Clear date"
              onClick={clearValue}
            >
              ×
            </button>
          )}

          {isOpen && !disabled && (
            <div
              className={styles.popover}
              role="dialog"
              aria-label="Choose month"
            >
              <div className={styles.popoverHeader}>
                <button
                  type="button"
                  className={`${styles.navButton} ${styles.right}`}
                  onClick={() => setViewYear((y) => y - 1)}
                />
                <div className={styles.yearLabel}>{viewYear}</div>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => setViewYear((y) => y + 1)}
                />
              </div>

              <div className={styles.monthGrid}>
                {monthLabels.map((m, idx) => {
                  const isSelected =
                    value?.year === viewYear && value?.month === idx + 1;

                  return (
                    <button
                      key={m}
                      type="button"
                      className={`${styles.monthButton} ${isSelected ? styles.selected : ""}`}
                      onClick={() => selectMonth(idx)}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";
