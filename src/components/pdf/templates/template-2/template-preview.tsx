"use client";

import type { ReactNode } from "react";

import {
  buildAddressLine,
  formatMonthYear,
  makeSidebarIcons,
  resolveAccentColor,
  TEMPLATE_PREVIEW_DATA,
} from "../template-preview-utils";
import styles from "./template-preview.module.scss";

interface TemplatePreview2Props {
  sidebarColor?: string;
}

const ContactRow = ({ icon, value }: { icon: ReactNode; value: string }) => (
  <div className={styles.contactRow}>
    <span className={styles.icon}>{icon}</span>
    <span className={styles.text}>{value}</span>
  </div>
);

export function TemplatePreview2({ sidebarColor }: TemplatePreview2Props) {
  const accentColor = resolveAccentColor(sidebarColor);

  const {
    IconPhone,
    IconEmail,
    IconLocation,
    IconBirthday,
    IconFlag,
    IconDocument,
    IconLinkedIn,
    IconGitHub,
  } = makeSidebarIcons(accentColor);

  const {
    contactDetails,
    sidebarSkills,
    languages,
    interests,
    summary,
    workTitle,
    workItems,
    educationTitle,
    educationItems,
    customSectionTitle,
    customSectionBody,
  } = TEMPLATE_PREVIEW_DATA;

  const addressLine = buildAddressLine(
    contactDetails.postalCode,
    contactDetails.city,
  );

  return (
    <div
      className={styles.preview}
      style={{
        ["--accent-color" as string]: accentColor,
      }}
    >
      <div className={styles.main}>
        <div className={styles.name}>{contactDetails.fullName}</div>
        <div className={styles.jobTitle}>{contactDetails.jobTitle}</div>

        <div className={styles.summary}>{summary}</div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            <div className={styles.sectionTitle}>{workTitle}</div>
          </div>
          {workItems.map((item) => {
            const title = item.jobTitle;
            const company = item.companyName;
            const cityLine = item.city;

            const subtitle =
              cityLine.trim().length > 0
                ? `${company}${company ? ", " : ""}${cityLine}`
                : company;

            const startLabel = formatMonthYear(item.startDate);
            const endLabel = item.endDate
              ? formatMonthYear(item.endDate)
              : "Current";
            const body = item.description;

            return (
              <div key={item.id} className={styles.workItem}>
                <div className={styles.workHeader}>
                  <div>
                    <div className={styles.workTitle}>{title}</div>
                    {subtitle ? (
                      <div className={styles.workSubtitle}>{subtitle}</div>
                    ) : null}
                  </div>
                  <div className={styles.workDate}>
                    <div>{startLabel}</div>
                    <div>{endLabel}</div>
                  </div>
                </div>

                {body.trim() ? (
                  <div className={styles.workBody}>{body}</div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            <div className={styles.sectionTitle}>{educationTitle}</div>
          </div>
          {educationItems.map((item) => (
            <div key={item.id} className={styles.workItem}>
              <div className={styles.workHeader}>
                <div>
                  <div className={styles.workTitle}>{item.title}</div>
                  <div className={styles.workSubtitle}>{item.subtitle}</div>
                </div>
                <div className={styles.workDate}>
                  <div>{item.startLabel}</div>
                  <div>{item.endLabel}</div>
                </div>
              </div>
              {item.body ? (
                <div className={styles.workBody}>{item.body}</div>
              ) : null}
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            <div className={styles.sectionTitle}>{customSectionTitle}</div>
          </div>
          <div className={styles.workBody}>{customSectionBody}</div>
        </div>
      </div>

      <div className={styles.sidebar} style={{ backgroundColor: sidebarColor }}>
        <div className={styles.avatar} />
        <ContactRow icon={IconPhone} value={contactDetails.phone} />
        <ContactRow icon={IconEmail} value={contactDetails.email} />
        <ContactRow icon={IconLocation} value={addressLine} />
        <ContactRow icon={IconBirthday} value={contactDetails.birthdate} />
        <ContactRow icon={IconFlag} value={contactDetails.nationality} />
        <ContactRow icon={IconDocument} value={contactDetails.workPermit} />
        <div className={styles.contactSpacer} />
        <ContactRow icon={IconLinkedIn} value={contactDetails.linkedIn} />
        <ContactRow icon={IconGitHub} value={contactDetails.git} />

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Skills</div>
          {sidebarSkills.map((value, idx) => (
            <div key={`skills-${idx}`} className={styles.item}>
              {value}
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Languages</div>
          {languages.map((value, idx) => (
            <div key={`languages-${idx}`} className={styles.item}>
              {value}
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Interests</div>
          {interests.map((value, idx) => (
            <div key={`interests-${idx}`} className={styles.item}>
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
