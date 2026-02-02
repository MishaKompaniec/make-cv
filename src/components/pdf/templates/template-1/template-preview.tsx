"use client";

import styles from "./template-preview.module.scss";

type ContactDetailsPreviewData = {
  fullName?: string;
  jobTitle?: string;
  phone?: string;
  email?: string;
  city?: string;
  birthdate?: string;
  postalCode?: string;
  linkedIn?: string;
  git?: string;
  nationality?: string;
  workPermit?: string;
};

type WorkExperiencePreviewItem = {
  id: string;
  jobTitle: string;
  companyName: string;
  city: string;
  startDate?: { month: number; year: number };
  endDate?: { month: number; year: number };
  description: string;
};

interface TemplatePreview1Props {
  sidebarColor?: string;
  mode?: "placeholder" | "data";
  contactDetails?: ContactDetailsPreviewData;
  workExperience?: WorkExperiencePreviewItem[];
}

export function TemplatePreview1({
  sidebarColor = "#EAE3D9",
  mode = "placeholder",
  contactDetails,
  workExperience,
}: TemplatePreview1Props) {
  const isPlaceholder = mode === "placeholder";

  const NBSP = "\u00A0";

  const ghostClass = (value: string) => (value ? "" : ` ${styles.ghost}`);

  const renderLine = (icon: string, value: string) => (
    <div className={styles.contactRow}>
      <span className={`${styles.icon}${ghostClass(value)}`}>{icon}</span>
      <span className={`${styles.text}${ghostClass(value)}`}>
        {value || NBSP}
      </span>
    </div>
  );

  const renderText = (
    Tag: "div" | "span",
    className: string,
    value: string,
  ) => {
    const Comp = Tag;
    return (
      <Comp className={`${className}${ghostClass(value)}`}>
        {value || NBSP}
      </Comp>
    );
  };

  const renderBulletRow = (value: string) => (
    <div className={styles.bulletRow}>
      <div className={`${styles.bullet}${ghostClass(value)}`} />
      <div className={`${styles.bulletText}${ghostClass(value)}`}>
        {value || NBSP}
      </div>
    </div>
  );

  const monthLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatMonthYear = (d?: { month: number; year: number }) => {
    if (!d) return "";
    const label = monthLong[d.month - 1] ?? "";
    return label ? `${label} ${d.year}` : "";
  };

  const fullName = isPlaceholder
    ? "John Doe"
    : (contactDetails?.fullName ?? "");
  const jobTitle = isPlaceholder
    ? "Professional Title"
    : (contactDetails?.jobTitle ?? "");
  const phone = isPlaceholder
    ? "+1 234 567 890"
    : (contactDetails?.phone ?? "");
  const email = isPlaceholder
    ? "email@example.com"
    : (contactDetails?.email ?? "");
  const city = isPlaceholder ? "City, Country" : (contactDetails?.city ?? "");
  const birthdate = isPlaceholder
    ? "01/01/1990"
    : (contactDetails?.birthdate ?? "");
  const postalCode = isPlaceholder
    ? "12345"
    : (contactDetails?.postalCode ?? "");
  const nationality = isPlaceholder
    ? "Nationality"
    : (contactDetails?.nationality ?? "");
  const workPermit = isPlaceholder
    ? "Work permit"
    : (contactDetails?.workPermit ?? "");
  const linkedIn = isPlaceholder
    ? "linkedin.com/in/username"
    : (contactDetails?.linkedIn ?? "");
  const git = isPlaceholder
    ? "github.com/username"
    : (contactDetails?.git ?? "");

  const addressLine = isPlaceholder
    ? "Street, 1"
    : postalCode || city
      ? `${postalCode ? `${postalCode}, ` : ""}${city}`
      : "";

  const sidebarSkill1 = isPlaceholder ? "Skill 1" : "";
  const sidebarSkill2 = isPlaceholder ? "Skill 2" : "";
  const sidebarSkill3 = isPlaceholder ? "Skill 3" : "";

  const showSidebarSkills =
    isPlaceholder || Boolean(sidebarSkill1 || sidebarSkill2 || sidebarSkill3);

  const language1 = isPlaceholder ? "Language 1" : "";
  const language2 = isPlaceholder ? "Language 2" : "";
  const language3 = isPlaceholder ? "Language 3" : "";

  const showLanguages =
    isPlaceholder || Boolean(language1 || language2 || language3);

  const summary = isPlaceholder
    ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
    : "";

  const showSummary = isPlaceholder || Boolean(summary.trim());

  const mainSkillsLabel = isPlaceholder ? "Skills:" : "";
  const mainSkill1 = isPlaceholder
    ? "Skill 1, Skill 2 with advanced knowledge"
    : "";
  const mainSkill2 = isPlaceholder ? "Skill 3 (intermediate level)" : "";
  const mainSkill3 = isPlaceholder ? "Skill 4 with 2+ years experience" : "";
  const mainSkill4 = isPlaceholder ? "Skill 5, certified professional" : "";

  const showMainSkills =
    isPlaceholder ||
    Boolean(
      mainSkill1 || mainSkill2 || mainSkill3 || mainSkill4 || mainSkillsLabel,
    );

  const workTitle =
    isPlaceholder || (workExperience && workExperience.length > 0)
      ? "Work history"
      : "";
  const placeholderWork = [
    {
      id: "p1",
      jobTitle: "Job Title",
      companyName: "Company Name",
      city: "City",
      startDate: { month: 9, year: 2022 },
      endDate: { month: 2, year: 2025 },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: "p2",
      jobTitle: "Job Title",
      companyName: "Company Name",
      city: "City",
      startDate: { month: 2, year: 2025 },
      endDate: undefined,
      description:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ];

  const workItems = isPlaceholder ? placeholderWork : (workExperience ?? []);

  const showWorkHistory = isPlaceholder || workItems.length > 0;

  const educationTitle = isPlaceholder ? "Education" : "";
  const eduItem1Title = isPlaceholder ? "Course Name" : "";
  const eduItem1Date = isPlaceholder ? "Month Year - Month Year" : "";
  const eduItem1Subtitle = isPlaceholder ? "Institution Name, City" : "";
  const eduItem2Title = isPlaceholder ? "Course Name" : "";
  const eduItem2Date = isPlaceholder ? "Month Year - Month Year" : "";
  const eduItem2Subtitle = isPlaceholder ? "Institution Name, City" : "";
  const eduItem2Body = isPlaceholder
    ? "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    : "";

  const showEducation =
    isPlaceholder ||
    Boolean(
      educationTitle ||
      eduItem1Title ||
      eduItem1Date ||
      eduItem1Subtitle ||
      eduItem2Title ||
      eduItem2Date ||
      eduItem2Subtitle ||
      eduItem2Body,
    );

  return (
    <div className={styles.preview}>
      <div className={styles.sidebar} style={{ backgroundColor: sidebarColor }}>
        <div className={styles.avatar} />
        {renderLine("☎", phone)}
        {renderLine("✉", email)}
        {renderLine("⌂", addressLine)}
        {renderLine("🎂", birthdate)}
        {renderLine("🏳", nationality)}
        {renderLine("🪪", workPermit)}
        {renderLine("in", linkedIn)}
        {renderLine("↗", git)}

        {showSidebarSkills && (
          <div className={styles.section}>
            {renderText(
              "div",
              styles.sectionTitle,
              isPlaceholder ? "Skills" : "",
            )}
            {renderText("div", styles.item, sidebarSkill1)}
            {renderText("div", styles.item, sidebarSkill2)}
            {renderText("div", styles.item, sidebarSkill3)}
          </div>
        )}

        {showLanguages && (
          <div className={styles.section}>
            {renderText(
              "div",
              styles.sectionTitle,
              isPlaceholder ? "Languages" : "",
            )}
            {renderText("div", styles.item, language1)}
            {renderText("div", styles.item, language2)}
            {renderText("div", styles.item, language3)}
          </div>
        )}
      </div>

      <div className={styles.main}>
        {renderText("div", styles.name, fullName)}
        {renderText("div", styles.jobTitle, jobTitle)}

        {showSummary && renderText("div", styles.summary, summary)}

        {showMainSkills && (
          <>
            {renderText("div", styles.label, mainSkillsLabel)}
            {renderBulletRow(mainSkill1)}
            {renderBulletRow(mainSkill2)}
            {renderBulletRow(mainSkill3)}
            {renderBulletRow(mainSkill4)}
          </>
        )}

        {showWorkHistory && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.sectionDot}${ghostClass(workTitle)}`} />
              {renderText("div", styles.sectionTitle, workTitle)}
            </div>
            {workItems.map((item) => {
              const title = isPlaceholder
                ? item.jobTitle
                : (item.jobTitle ?? "");
              const company = isPlaceholder
                ? item.companyName
                : (item.companyName ?? "");
              const cityLine = isPlaceholder ? item.city : (item.city ?? "");

              const subtitle =
                cityLine.trim().length > 0
                  ? `${company}${company ? ", " : ""}${cityLine}`
                  : company;

              const startLabel = formatMonthYear(item.startDate);
              const endLabel = item.endDate
                ? formatMonthYear(item.endDate)
                : "Current";
              const body = isPlaceholder
                ? item.description
                : (item.description ?? "");

              return (
                <div key={item.id} className={styles.workItem}>
                  <div className={styles.workHeader}>
                    {renderText("div", styles.workTitle, title)}
                    {isPlaceholder ? (
                      renderText(
                        "div",
                        styles.workDate,
                        `${startLabel} - ${endLabel}`,
                      )
                    ) : (
                      <div
                        className={`${styles.workDate}${ghostClass(startLabel)}`}
                      >
                        <div>{startLabel || NBSP}</div>
                        <div>{endLabel || NBSP}</div>
                      </div>
                    )}
                  </div>

                  {subtitle ? (
                    <div className={styles.workSubtitle}>{subtitle}</div>
                  ) : null}

                  {body.trim() ? (
                    <div className={styles.workBody}>{body}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {showEducation && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div
                className={`${styles.sectionDot}${ghostClass(educationTitle)}`}
              />
              {renderText("div", styles.sectionTitle, educationTitle)}
            </div>
            <div className={styles.workItem}>
              <div className={styles.workHeader}>
                {renderText("div", styles.workTitle, eduItem1Title)}
                {renderText("div", styles.workDate, eduItem1Date)}
              </div>
              {renderText("div", styles.workSubtitle, eduItem1Subtitle)}
            </div>
            <div className={styles.workItem}>
              <div className={styles.workHeader}>
                {renderText("div", styles.workTitle, eduItem2Title)}
                {renderText("div", styles.workDate, eduItem2Date)}
              </div>
              {renderText("div", styles.workSubtitle, eduItem2Subtitle)}
              {renderText("div", styles.workBody, eduItem2Body)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
