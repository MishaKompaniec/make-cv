import { forwardRef } from "react";

import styles from "./skill-tag.module.scss";

interface SkillTagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const SkillTag = forwardRef<HTMLButtonElement, SkillTagProps>(
  ({ label, isActive, onClick }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`${styles.skillTag} ${isActive ? styles.active : ""}`}
        onClick={onClick}
      >
        {label}
      </button>
    );
  },
);

SkillTag.displayName = "SkillTag";
