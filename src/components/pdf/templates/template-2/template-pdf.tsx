import type { ReactNode } from "react";
import {
  StyleSheet,
  Document,
  Page,
  Path,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

export const TEMPLATE_2_ID = "template-2-v1";

export const TEMPLATE_2_COLORS = [
  { name: "beige", value: "#EFEAE2" },
  { name: "light-blue", value: "#E8F4F8" },
  { name: "light-gray", value: "#F5F5F5" },
  { name: "light-green", value: "#E8F5E8" },
  { name: "light-purple", value: "#F0EBF8" },
];

const TEMPLATE_2_ACCENT_BY_SIDEBAR_COLOR: Record<string, string> = {
  "#efeae2": "#bfac8c",
  "#e8f4f8": "#297b96",
  "#f5f5f5": "#6e6565",
  "#e8f5e8": "#2a5c2a",
  "#f0ebf8": "#604f7d",
};

const normalizeHex = (value: string) => value.trim().toLowerCase();

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  sidebar: {
    width: "30%",
    paddingTop: 28,
    paddingLeft: 18,
    paddingRight: 18,
  },
  main: {
    width: "70%",
    paddingTop: 28,
    paddingLeft: 28,
    paddingRight: 28,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
    color: "#111111",
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 14,
  },
  summary: {
    fontSize: 10,
    color: "#2B2B2B",
    marginBottom: 20,
    lineHeight: 1.4,
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2B2B2B",
    marginBottom: 4,
  },
  skillLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#2B2B2B",
    marginBottom: 4,
  },
  sidebarInfoRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  sidebarInfoLabel: {
    width: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
  },
  sidebarInfoIcon: {
    width: 10,
    height: 10,
  },
  sidebarInfoText: {
    flex: 1,
    fontSize: 8,
    color: "#2B2B2B",
  },
  skillItem: { marginBottom: "4px", fontSize: 10, color: "#2B2B2B" },
  mainSection: {
    marginTop: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111111",
  },
  item: {
    marginBottom: 14,
  },
  itemHeader: {
    marginBottom: 4,
  },
  itemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#111111",
  },
  itemDate: {
    fontSize: 9,
    color: "#2B2B2B",
    textAlign: "right",
  },
  itemSubtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemSubtitle: {
    fontSize: 9,
    marginBottom: 4,
  },
  itemBody: {
    fontSize: 9,
    color: "#2B2B2B",
    lineHeight: 1.35,
  },
});

type Template2Props = {
  sidebarColor?: string;
  contactDetails?: {
    fullName?: string;
    jobTitle?: string;
    phone?: string;
    email?: string;
    city?: string;
    postalCode?: string;
    linkedIn?: string;
    git?: string;
    birthdate?: string;
    nationality?: string;
    workPermit?: string;
  };
  workExperience?: {
    id: string;
    jobTitle: string;
    companyName: string;
    city: string;
    startDate?: { month: number; year: number };
    endDate?: { month: number; year: number };
    description: string;
  }[];
  education?: {
    id: string;
    diploma: string;
    schoolName: string;
    schoolLocation: string;
    startDate?: { month: number; year: number };
    endDate?: { month: number; year: number };
    description: string;
  }[];
  skills?: {
    id: string;
    title: string;
  }[];
  summary?: string;
};

export function TemplatePdf2({
  sidebarColor = "#EFEAE2",
  contactDetails,
  workExperience = [],
  education = [],
  skills = [],
  summary,
}: Template2Props) {
  const fullName = contactDetails?.fullName || "";
  const email = contactDetails?.email || "";
  const phone = contactDetails?.phone || "";
  const jobTitle = contactDetails?.jobTitle || "";
  const city = contactDetails?.city || "";
  const postalCode = contactDetails?.postalCode || "";
  const addressLine =
    postalCode || city ? `${postalCode ? `${postalCode}, ` : ""}${city}` : "";
  const linkedIn = contactDetails?.linkedIn || "";
  const git = contactDetails?.git || "";
  const birthdate = contactDetails?.birthdate || "";
  const nationality = contactDetails?.nationality || "";
  const workPermit = contactDetails?.workPermit || "";

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

  const hasSidebarInfo = Boolean(
    phone ||
    email ||
    addressLine ||
    birthdate ||
    nationality ||
    workPermit ||
    linkedIn ||
    git,
  );

  const cleanedSkills = skills
    .map((s) => ({ ...s, title: s.title?.trim?.() ?? "" }))
    .filter((s) => s.title);
  const hasSkills = cleanedSkills.length > 0;

  const hasHeader = Boolean(fullName || jobTitle);
  const hasWorkExperience = workExperience.some(
    (w) => w.jobTitle?.trim() || w.companyName?.trim() || w.description?.trim(),
  );
  const hasEducation = education.some(
    (e) =>
      e.diploma?.trim() ||
      e.schoolName?.trim() ||
      e.schoolLocation?.trim() ||
      e.description?.trim(),
  );

  const renderSidebarRow = (icon: ReactNode, value: string) => {
    if (!value) return null;
    return (
      <View style={styles.sidebarInfoRow}>
        <View style={styles.sidebarInfoLabel}>{icon}</View>
        <Text style={styles.sidebarInfoText}>{value}</Text>
      </View>
    );
  };

  const accentColor =
    TEMPLATE_2_ACCENT_BY_SIDEBAR_COLOR[normalizeHex(sidebarColor)] ?? "#2B2B2B";

  const iconColor = accentColor;

  const IconPhone = (
    <Svg viewBox="0 0 24 24" style={styles.sidebarInfoIcon}>
      <Path
        fill={iconColor}
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      />
    </Svg>
  );

  const IconEmail = (
    <Svg viewBox="0 0 24 24" style={styles.sidebarInfoIcon}>
      <Path
        fill={iconColor}
        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
      />
    </Svg>
  );

  const IconBirthday = (
    <Svg viewBox="0 0 50 50" style={styles.sidebarInfoIcon}>
      <Path
        fill={iconColor}
        d="M25 0.09375L24.21875 1.09375C23.515625 1.992188 20 6.578125 20 9C20 11.414063 21.722656 13.441406 24 13.90625L24 10C24 9.449219 24.449219 9 25 9C25.550781 9 26 9.449219 26 10L26 13.90625C28.277344 13.441406 30 11.414063 30 9C30 6.578125 26.484375 1.992188 25.78125 1.09375 Z M 23 15C21.347656 15 20 16.347656 20 18L20 26L30 26L30 18C30 16.347656 28.652344 15 27 15 Z M 11 28C8.179688 28 5.761719 29.683594 4.65625 32.09375C5.226563 33.597656 5.804688 34.398438 5.8125 34.40625C6.703125 35.59375 8.390625 37 11.40625 37C13.863281 37 15.6875 36.15625 17 34.40625L17.75 33.375L18.5625 34.375C20.042969 36.152344 22.152344 37 25 37C27.769531 37 30 36.101563 31.4375 34.375L32.25 33.375L33 34.40625C34.3125 36.15625 36.136719 37 38.59375 37C41.050781 37 42.875 36.15625 44.1875 34.40625C44.214844 34.371094 44.964844 33.414063 45.375 32.125C44.277344 29.691406 41.839844 28 39 28 Z M 4 35.3125L4 42L46 42L46 35.34375C45.875 35.523438 45.792969 35.609375 45.78125 35.625C44.113281 37.847656 41.679688 39 38.59375 39C35.941406 39 33.785156 38.167969 32.15625 36.5C30.753906 37.785156 28.5 39 25 39C22.039063 39 19.640625 38.164063 17.84375 36.5C16.214844 38.164063 14.054688 39 11.40625 39C7.5625 39 5.351563 37.144531 4.1875 35.59375C4.175781 35.578125 4.113281 35.484375 4 35.3125 Z M 0 44L0 45C0 50 4.890625 50 6.5 50L43.5 50C45.105469 50 50 50 50 45L50 44Z"
      />
    </Svg>
  );

  const IconFlag = (
    <Svg viewBox="0 0 94.033 94.032" style={styles.sidebarInfoIcon}>
      <Path
        fill={iconColor}
        d="M13.252,5.788H4.054c-1.104,0-2,0.896-2,2v84.244c0,1.104,0.896,2,2,2h9.198c1.104,0,2-0.896,2-2V7.788 C15.252,6.684,14.357,5.788,13.252,5.788z"
      />
      <Path
        fill={iconColor}
        d="M91.139,5.736C85.721,1.876,80.442,0,75.001,0c-6.857,0-13.004,2.996-18.953,5.896c-5.991,2.922-11.65,5.682-17.989,5.682 c-4.648,0-9.184-1.522-13.865-4.653c-0.614-0.411-1.404-0.45-2.054-0.102c-0.651,0.348-1.058,1.025-1.058,1.764v45.027 c0,0.646,0.313,1.254,0.839,1.629c5.418,3.86,10.697,5.735,16.136,5.735c6.871,0,13.021-3.002,18.968-5.903 C63.01,52.157,68.664,49.4,75.001,49.4c4.646,0,9.181,1.521,13.865,4.654c0.614,0.41,1.403,0.449,2.053,0.102 c0.652-0.348,1.059-1.025,1.059-1.764V7.365C91.978,6.718,91.666,6.111,91.139,5.736z"
      />
    </Svg>
  );

  const IconDocument = (
    <Svg viewBox="0 0 16 16" style={styles.sidebarInfoIcon}>
      <Path
        fill={iconColor}
        d="M16 2H0V14H16V2ZM5 10.5C6.38071 10.5 7.5 9.38071 7.5 8C7.5 6.61929 6.38071 5.5 5 5.5C3.61929 5.5 2.5 6.61929 2.5 8C2.5 9.38071 3.61929 10.5 5 10.5ZM10 5H14V7H10V5ZM14 9H10V11H14V9Z"
      />
    </Svg>
  );

  const IconLocation = (
    <Svg viewBox="144 144 512 512" style={styles.sidebarInfoIcon}>
      <Path
        fill={iconColor}
        d="m400 173.29c-35.887 0.011719-70.301 14.273-95.676 39.648s-39.637 59.789-39.648 95.676c0 114.52 135.32 318.1 135.32 318.1s135.32-203.59 135.32-318.1c-0.011718-35.887-14.273-70.301-39.648-95.676s-59.789-39.637-95.672-39.648zm0 217.19c-21.715 0-42.539-8.625-57.891-23.98-15.355-15.352-23.98-36.176-23.98-57.887 0-21.715 8.625-42.539 23.98-57.891 15.352-15.355 36.176-23.98 57.891-23.98 21.711 0 42.535 8.625 57.887 23.98 15.355 15.352 23.98 36.176 23.98 57.891-0.027344 21.703-8.6602 42.512-24.008 57.859s-36.156 23.98-57.859 24.008z"
      />
      <Path
        fill={iconColor}
        d="m427.25 311.78c0 15.055-12.203 27.258-27.254 27.258-15.055 0-27.258-12.203-27.258-27.258s12.203-27.258 27.258-27.258c15.051 0 27.254 12.203 27.254 27.258"
      />
    </Svg>
  );

  const wrapUrl = (value: string) => value.replaceAll("/", "/ ");
  const linkedInSafe = linkedIn ? wrapUrl(linkedIn) : "";
  const gitSafe = git ? wrapUrl(git) : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.main}>
          {hasHeader ? (
            <>
              {fullName ? <Text style={styles.name}>{fullName}</Text> : null}
              {jobTitle ? (
                <Text style={[styles.jobTitle, { color: accentColor }]}>
                  {jobTitle}
                </Text>
              ) : null}
              {summary ? <Text style={styles.summary}>{summary}</Text> : null}
            </>
          ) : null}

          {hasWorkExperience ? (
            <View style={styles.mainSection}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[
                    styles.sectionDot,
                    {
                      backgroundColor: accentColor,
                      position: "absolute",
                      left: -15,
                    },
                  ]}
                />
                <Text style={styles.sectionTitle}>Work history</Text>
              </View>

              {workExperience.map((item) => {
                const title = item.jobTitle?.trim() ?? "";
                const company = item.companyName?.trim() ?? "";
                const itemCity = item.city?.trim() ?? "";
                const body = item.description?.trim() ?? "";

                const start = formatMonthYear(item.startDate);
                const end = item.endDate
                  ? formatMonthYear(item.endDate)
                  : item.startDate
                    ? "Current"
                    : "";

                const subtitle = itemCity ? `${company}, ${itemCity}` : company;
                const hasItem = Boolean(
                  title || subtitle || body || start || end,
                );
                if (!hasItem) return null;

                return (
                  <View key={item.id} style={styles.item}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        {title ? (
                          <Text style={styles.itemTitle}>{title}</Text>
                        ) : (
                          <Text style={styles.itemTitle} />
                        )}
                        {start ? (
                          <Text style={styles.itemDate}>{start}</Text>
                        ) : null}
                      </View>
                      <View style={styles.itemSubtitleRow}>
                        <Text
                          style={[styles.itemSubtitle, { color: accentColor }]}
                        >
                          {subtitle || " "}
                        </Text>
                        {end ? (
                          <Text style={styles.itemDate}>{end}</Text>
                        ) : null}
                      </View>
                    </View>
                    {body ? <Text style={styles.itemBody}>{body}</Text> : null}
                  </View>
                );
              })}
            </View>
          ) : null}

          {hasEducation ? (
            <View style={styles.mainSection}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[
                    styles.sectionDot,
                    {
                      backgroundColor: accentColor,
                      position: "absolute",
                      left: -15,
                    },
                  ]}
                />
                <Text style={styles.sectionTitle}>Education</Text>
              </View>

              {education.map((item) => {
                const title = item.diploma?.trim() ?? "";
                const school = item.schoolName?.trim() ?? "";
                const location = item.schoolLocation?.trim() ?? "";
                const body = item.description?.trim() ?? "";

                const start = formatMonthYear(item.startDate);
                const end = item.endDate
                  ? formatMonthYear(item.endDate)
                  : item.startDate
                    ? "Current"
                    : "";

                const subtitle =
                  school && location
                    ? `${school}, ${location}`
                    : school || location;

                const hasItem = Boolean(
                  title || subtitle || body || start || end,
                );
                if (!hasItem) return null;

                return (
                  <View key={item.id} style={styles.item}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTitleRow}>
                        {title ? (
                          <Text style={styles.itemTitle}>{title}</Text>
                        ) : (
                          <Text style={styles.itemTitle} />
                        )}
                        {start ? (
                          <Text style={styles.itemDate}>{start}</Text>
                        ) : null}
                      </View>
                      <View style={styles.itemSubtitleRow}>
                        <Text
                          style={[styles.itemSubtitle, { color: accentColor }]}
                        >
                          {subtitle || " "}
                        </Text>
                        {end ? (
                          <Text style={styles.itemDate}>{end}</Text>
                        ) : null}
                      </View>
                    </View>
                    {body ? <Text style={styles.itemBody}>{body}</Text> : null}
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>

        <View style={[styles.sidebar, { backgroundColor: sidebarColor }]}>
          {hasSidebarInfo ? (
            <>
              {renderSidebarRow(IconPhone, phone)}
              {renderSidebarRow(IconEmail, email)}
              {renderSidebarRow(IconLocation, addressLine)}
              {renderSidebarRow(IconBirthday, birthdate)}
              {renderSidebarRow(IconFlag, nationality)}
              {renderSidebarRow(IconDocument, workPermit)}
              <View style={{ marginBottom: 12 }} />
              {renderSidebarRow(
                <Text style={[styles.label, { color: accentColor }]}>In</Text>,
                linkedInSafe,
              )}
              {renderSidebarRow(
                <Text style={[styles.label, { color: accentColor }]}>Git</Text>,
                gitSafe,
              )}
            </>
          ) : null}

          {hasSkills ? (
            <View style={{ marginTop: hasSidebarInfo ? 12 : 0 }}>
              <Text style={styles.skillLabel}>Skills</Text>
              {cleanedSkills.map((s) => (
                <Text key={s.id} style={[styles.skillItem]}>
                  {s.title}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
