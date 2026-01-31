"use client";

import { useEffect, useState } from "react";
import styles from "./template-preview.module.scss";

interface TemplatePreview1Props {
  sidebarColor?: string;
}

export function TemplatePreview1({
  sidebarColor = "#EAE3D9",
}: TemplatePreview1Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={styles.preview}>
      <div
        className={styles.sidebar}
        style={isClient ? { backgroundColor: sidebarColor } : {}}
      >
        <div className={styles.avatar} />
        <div className={styles.contactRow}>
          <span className={styles.icon}>☎</span>
          <span className={styles.text}>+380660536975</span>
        </div>
        <div className={styles.contactRow}>
          <span className={styles.icon}>✉</span>
          <span className={styles.text}>mishakompaniec@gmail.com</span>
        </div>
        <div className={styles.contactRow}>
          <span className={styles.icon}>⌂</span>
          <span className={styles.text}>Pola de Siero</span>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Skills</div>
          <div className={styles.item}>React</div>
          <div className={styles.item}>Next</div>
          <div className={styles.item}>Node.js</div>
          <div className={styles.item}>Express</div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Languages</div>
          <div className={styles.item}>Ukrainian (native speaker)</div>
          <div className={styles.item}>Russian (native speaker)</div>
          <div className={styles.item}>English (B1)</div>
          <div className={styles.item}>Spanish (A1)</div>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.name}>Misha Kompaniec</div>
        <div className={styles.jobTitle}>Fullstack Developer</div>
        <div className={styles.summary}>
          Due to life circumstances in my country, I decided to change my
          profession and completely transform my life. I began developing skills
          as a frontend developer. Later, the project required basic backend
          knowledge, so I started to deepen my understanding of Node.js. I have
          been building websites using React for almost 3 years, and for the
          past six months, I have been using Node.js to handle backendrelated
          tasks.
        </div>

        <div className={styles.label}>Skills:</div>
        <div className={styles.bulletRow}>
          <div className={styles.bullet} />
          <div className={styles.bulletText}>React (TypeScript), Next</div>
        </div>
        <div className={styles.bulletRow}>
          <div className={styles.bullet} />
          <div className={styles.bulletText}>Node.js + Express</div>
        </div>
        <div className={styles.bulletRow}>
          <div className={styles.bullet} />
          <div className={styles.bulletText}>MongoDB</div>
        </div>
        <div className={styles.bulletRow}>
          <div className={styles.bullet} />
          <div className={styles.bulletText}>Redux, RTK</div>
        </div>
        <div className={styles.bulletRow}>
          <div className={styles.bullet} />
          <div className={styles.bulletText}>
            JSS, Styled-Components, Tailwind
          </div>
        </div>
        <div className={styles.bulletRow}>
          <div className={styles.bullet} />
          <div className={styles.bulletText}>Prettier, ESLint, Husky</div>
        </div>
        <div className={styles.bulletRow}>
          <div className={styles.bullet} />
          <div className={styles.bulletText}>Ant Design, Material UI</div>
        </div>
        <div className={styles.bulletRow}>
          <div className={styles.bullet} />
          <div className={styles.bulletText}>Git/GitHub</div>
        </div>

        <div className={styles.label}>Contacts:</div>
        <div className={styles.contactItem}>Telegram: @MishaKompaniec</div>
        <div className={styles.contactItem}>
          GitHub: https://github.com/MishaKompaniec
        </div>
        <div className={styles.contactItem}>Instagram: misha_kompaniec</div>
        <div className={styles.contactItem}>
          Spanish phone number: +34657732224
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            <div className={styles.sectionTitle}>Work history</div>
          </div>
          <div className={styles.workItem}>
            <div className={styles.workHeader}>
              <div className={styles.workTitle}>Frontend developer</div>
              <div className={styles.workDate}>
                September 2022 - February 2025
              </div>
            </div>
            <div className={styles.workSubtitle}>
              UniCode Software, Cherkassy
            </div>
            <div className={styles.workBody}>
              Worked on a project for an American company related to health and
              safety. Also worked on the company's internal website, UniCode.
            </div>
          </div>
          <div className={styles.workItem}>
            <div className={styles.workHeader}>
              <div className={styles.workTitle}>Full-stack developer</div>
              <div className={styles.workDate}>February 2025 - Current</div>
            </div>
            <div className={styles.workSubtitle}>
              UniCode Software, Cherkassy
            </div>
            <div className={styles.workBody}>
              During my time working on the project, I started learning Node.js
              and taking on backend tasks.
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            <div className={styles.sectionTitle}>Education</div>
          </div>
          <div className={styles.workItem}>
            <div className={styles.workHeader}>
              <div className={styles.workTitle}>
                JavaScript: Advanced Course
              </div>
              <div className={styles.workDate}>April 2022 - July 2022</div>
            </div>
            <div className={styles.workSubtitle}>ITVDN, Kiev</div>
          </div>
          <div className={styles.workItem}>
            <div className={styles.workHeader}>
              <div className={styles.workTitle}>React: Advanced Course</div>
              <div className={styles.workDate}>July 2022 - September 2022</div>
            </div>
            <div className={styles.workSubtitle}>UniCode, Cherkassy</div>
            <div className={styles.workBody}>
              Before working at the company, I completed the company's internal
              courses on React and Next.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
