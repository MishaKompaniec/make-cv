import {
  Document,
  Font,
  Image,
  Link,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";

export const TEMPLATE_1_ID = "template-1-v1";

export const TEMPLATE_1_COLORS = [
  { name: "beige", value: "#EFEAE2" },
  { name: "light-blue", value: "#E8F4F8" },
  { name: "light-gray", value: "#F5F5F5" },
  { name: "light-green", value: "#E8F5E8" },
  { name: "light-purple", value: "#F0EBF8" },
];

const TEMPLATE_1_ACCENT_BY_SIDEBAR_COLOR: Record<string, string> = {
  "#efeae2": "#bfac8c",
  "#e8f4f8": "#297b96",
  "#f5f5f5": "#6e6565",
  "#e8f5e8": "#357a38",
  "#f0ebf8": "#725ea8",
};

Font.register({
  family: "Inter",
  fonts: [
    {
      src: new URL(
        "../../../../assets/fonts/Inter-Regular.ttf",
        import.meta.url,
      ).toString(),
      fontWeight: 400,
    },
    {
      src: new URL(
        "../../../../assets/fonts/Inter-Medium.ttf",
        import.meta.url,
      ).toString(),
      fontWeight: 500,
    },
    {
      src: new URL(
        "../../../../assets/fonts/Inter-SemiBold.ttf",
        import.meta.url,
      ).toString(),
      fontWeight: 600,
    },
    {
      src: new URL(
        "../../../../assets/fonts/Inter-Bold.ttf",
        import.meta.url,
      ).toString(),
      fontWeight: 700,
    },
  ],
});

const normalizeHex = (value: string) => value.trim().toLowerCase();

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter",
  },
  sidebar: {
    width: "30%",
    paddingTop: 28,
    paddingLeft: 18,
    paddingRight: 18,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#CFCFCF",
    alignSelf: "center",
    marginBottom: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  main: {
    width: "70%",
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
    color: "#111111",
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 10,
    color: "#111111",
  },
  summary: {
    fontSize: 10,
    color: "#111111",
    marginBottom: 10,
    lineHeight: 1.4,
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    color: "#111111",
    marginBottom: 4,
  },
  skillLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: "#111111",
    marginBottom: 4,
  },
  sidebarInfoRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
    gap: "6px",
  },
  sidebarInfoLabel: {
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
    color: "#111111",
  },
  sidebarInfoValue: {
    flex: 1,
    justifyContent: "center",
  },
  sidebarLink: {
    fontSize: 8,
    lineHeight: 1.35,
    color: "#000000",
    textDecoration: "underline",
    textDecorationColor: "#000000",
  },
  spacer12: {
    marginBottom: 12,
  },
  mt12: {
    marginTop: 12,
  },
  mt0: {
    marginTop: 0,
  },
  skillItem: { marginBottom: "4px", fontSize: 8, color: "#111111" },
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
    width: 6,
    height: 6,
    borderRadius: 4,
    position: "absolute",
    left: -12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
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
    fontWeight: 600,
    color: "#111111",
  },
  itemDate: {
    fontSize: 9,
    color: "#111111",
    textAlign: "right",
  },
  itemSubtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemSubtitle: {
    fontSize: 9,
    marginBottom: 4,
    fontWeight: 500,
    color: "#111111",
  },
  itemBody: {
    fontSize: 9,
    color: "#111111",
    lineHeight: 1.35,
  },
});

type Template1Props = {
  sidebarColor?: string;
  contactDetails?: {
    fullName?: string;
    jobTitle?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    city?: string;
    postalCode?: string;
    linkedIn?: string;
    git?: string;
    linkedInTitle?: string;
    linkedInUrl?: string;
    gitTitle?: string;
    gitUrl?: string;
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
  languages?: {
    id: string;
    name: string;
    level: string;
  }[];
  interests?: {
    id: string;
    title: string;
  }[];
  customSections?: {
    id: string;
    title: string;
    description: string;
  }[];
  selectedSections?: {
    languages: boolean;
    interests: boolean;
    customSection: boolean;
  };
  summary?: string;
};

export function TemplatePdf1({
  sidebarColor = "#EFEAE2",
  contactDetails,
  workExperience = [],
  education = [],
  skills = [],
  languages = [],
  interests = [],
  customSections = [],
  selectedSections,
  summary,
}: Template1Props) {
  const fullName = contactDetails?.fullName || "";
  const email = contactDetails?.email || "";
  const phone = contactDetails?.phone || "";
  const jobTitle = contactDetails?.jobTitle || "";
  const avatar = contactDetails?.avatar || "";
  const city = contactDetails?.city || "";
  const postalCode = contactDetails?.postalCode || "";
  const addressLine =
    postalCode || city ? `${postalCode ? `${postalCode}, ` : ""}${city}` : "";
  const linkedInTitleRaw = contactDetails?.linkedInTitle || "";
  const linkedInUrlRaw =
    contactDetails?.linkedInUrl || contactDetails?.linkedIn || "";
  const gitTitleRaw = contactDetails?.gitTitle || "";
  const gitUrlRaw = contactDetails?.gitUrl || contactDetails?.git || "";
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
    linkedInUrlRaw ||
    gitUrlRaw,
  );

  const cleanedSkills = skills
    .map((s) => ({ ...s, title: s.title?.trim?.() ?? "" }))
    .filter((s) => s.title);
  const hasSkills = cleanedSkills.length > 0;

  const cleanedLanguages = languages
    .map((l) => ({
      ...l,
      name: l.name?.trim?.() ?? "",
      level: l.level?.trim?.() ?? "",
    }))
    .filter((l) => l.name);
  const shouldShowLanguages = selectedSections?.languages ?? true;
  const hasLanguages = shouldShowLanguages && cleanedLanguages.length > 0;

  const cleanedInterests = interests
    .map((i) => ({
      ...i,
      title: i.title?.trim?.() ?? "",
    }))
    .filter((i) => i.title);
  const shouldShowInterests = selectedSections?.interests ?? true;
  const hasInterests = shouldShowInterests && cleanedInterests.length > 0;

  const cleanedCustomSections = customSections
    .map((s) => ({
      ...s,
      title: s.title?.trim?.() ?? "",
      description: s.description?.trim?.() ?? "",
    }))
    .filter((s) => s.title);
  const shouldShowCustomSections = selectedSections?.customSection ?? true;
  const hasCustomSections =
    shouldShowCustomSections && cleanedCustomSections.length > 0;

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

  const renderSidebarRow = (icon: ReactNode, value: ReactNode) => {
    if (!value) return null;
    return (
      <View style={styles.sidebarInfoRow}>
        <View style={styles.sidebarInfoLabel}>{icon}</View>
        {typeof value === "string" ? (
          <Text style={styles.sidebarInfoText}>{value}</Text>
        ) : (
          <View style={styles.sidebarInfoValue}>{value}</View>
        )}
      </View>
    );
  };

  const accentColor =
    TEMPLATE_1_ACCENT_BY_SIDEBAR_COLOR[normalizeHex(sidebarColor)] ?? "#2B2B2B";

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
        d="M400 173.29c-35.887 0.011719-70.301 14.273-95.676 39.648s-39.637 59.789-39.648 95.676c0 114.52 135.32 318.1 135.32 318.1s135.32-203.59 135.32-318.1c-0.011718-35.887-14.273-70.301-39.648-95.676s-59.789-39.637-95.672-39.648zm0 217.19c-21.715 0-42.539-8.625-57.891-23.98-15.355-15.352-23.98-36.176-23.98-57.887 0-21.715 8.625-42.539 23.98-57.891 15.352-15.355 36.176-23.98 57.891-23.98 21.711 0 42.535 8.625 57.887 23.98 15.355 15.352 23.98 36.176 23.98 57.891-0.027344 21.703-8.6602 42.512-24.008 57.859s-36.156 23.98-57.859 24.008z"
      />
      <Path
        fill={iconColor}
        d="M427.25 311.78c0 15.055-12.203 27.258-27.254 27.258-15.055 0-27.258-12.203-27.258-27.258s12.203-27.258 27.258-27.258c15.051 0 27.254 12.203 27.254 27.258"
      />
    </Svg>
  );

  const IconLinkedIn = (
    <Svg viewBox="0 0 24 24" style={styles.sidebarInfoIcon}>
      <Path
        fill={iconColor}
        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
      />
    </Svg>
  );

  const IconGitHub = (
    <Svg viewBox="0 0 24 24" style={styles.sidebarInfoIcon}>
      <Path
        fill={iconColor}
        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      />
    </Svg>
  );

  const normalizeUrl = (value: string) => {
    const raw = value.trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw}`;
  };

  const linkedInTitle = linkedInTitleRaw.trim();
  const linkedInUrl = linkedInUrlRaw.trim();
  const gitTitle = gitTitleRaw.trim();
  const gitUrl = gitUrlRaw.trim();

  const linkedInText = (linkedInTitle || linkedInUrl) as string;
  const gitText = (gitTitle || gitUrl) as string;

  const linkedInHref = normalizeUrl(linkedInUrl);
  const gitHref = normalizeUrl(gitUrl);

  const linkedInSafe = linkedInText;
  const gitSafe = gitText;

  const avatarSrc = avatar.trim();
  const hasAvatar = Boolean(avatarSrc && avatarSrc.startsWith("data:image/"));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.sidebar, { backgroundColor: sidebarColor }]}>
          {hasAvatar ? (
            <View style={styles.avatarWrap}>
              {/* eslint-disable jsx-a11y/alt-text */}
              <Image src={avatarSrc} style={styles.avatarImage} />
            </View>
          ) : null}

          {hasSidebarInfo ? (
            <>
              {renderSidebarRow(IconPhone, phone)}
              {renderSidebarRow(IconEmail, email)}
              {renderSidebarRow(IconLocation, addressLine)}
              {renderSidebarRow(IconBirthday, birthdate)}
              {renderSidebarRow(IconFlag, nationality)}
              {renderSidebarRow(IconDocument, workPermit)}
              <View style={styles.spacer12} />
              {renderSidebarRow(
                IconLinkedIn,
                linkedInHref ? (
                  <Link src={linkedInHref} style={styles.sidebarLink}>
                    {linkedInSafe}
                  </Link>
                ) : (
                  linkedInSafe
                ),
              )}
              {renderSidebarRow(
                IconGitHub,
                gitHref ? (
                  <Link src={gitHref} style={styles.sidebarLink}>
                    {gitSafe}
                  </Link>
                ) : (
                  gitSafe
                ),
              )}
            </>
          ) : null}

          {hasSkills ? (
            <View style={hasSidebarInfo ? styles.mt12 : styles.mt0}>
              <Text style={styles.skillLabel}>Skills</Text>
              {cleanedSkills.map((s) => (
                <Text key={s.id} style={[styles.skillItem]}>
                  {s.title}
                </Text>
              ))}
            </View>
          ) : null}

          {hasLanguages ? (
            <View
              style={hasSkills || hasSidebarInfo ? styles.mt12 : styles.mt0}
            >
              <Text style={styles.skillLabel}>Languages</Text>
              {cleanedLanguages.map((l) => (
                <Text key={l.id} style={[styles.skillItem]}>
                  {l.name} - {l.level}
                </Text>
              ))}
            </View>
          ) : null}

          {hasInterests ? (
            <View
              style={
                hasLanguages || hasSkills || hasSidebarInfo
                  ? styles.mt12
                  : styles.mt0
              }
            >
              <Text style={styles.skillLabel}>Interests</Text>
              {cleanedInterests.map((i) => (
                <Text key={i.id} style={[styles.skillItem]}>
                  {i.title}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

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
              {(() => {
                const items = workExperience
                  .map((item) => {
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

                    const subtitle = itemCity
                      ? `${company}, ${itemCity}`
                      : company;
                    const hasItem = Boolean(
                      title || subtitle || body || start || end,
                    );

                    if (!hasItem) return null;

                    return {
                      id: item.id,
                      title,
                      subtitle,
                      start,
                      end,
                      body,
                    };
                  })
                  .filter(Boolean);

                if (items.length === 0) return null;

                const [first, ...rest] = items;

                const renderItem = (
                  item: {
                    id: string;
                    title: string;
                    subtitle: string;
                    body: string;
                    start: string;
                    end: string;
                  } | null,
                ) => {
                  if (!item) return null;
                  return (
                    <View key={item.id} style={styles.item} wrap={false}>
                      <View style={styles.itemHeader}>
                        <View style={styles.itemTitleRow}>
                          {item.title ? (
                            <Text style={styles.itemTitle}>{item.title}</Text>
                          ) : (
                            <Text style={styles.itemTitle} />
                          )}
                          {item.start ? (
                            <Text style={styles.itemDate}>{item.start}</Text>
                          ) : null}
                        </View>
                        <View style={styles.itemSubtitleRow}>
                          <Text
                            style={[
                              styles.itemSubtitle,
                              { color: accentColor },
                            ]}
                          >
                            {item.subtitle || " "}
                          </Text>
                          {item.end ? (
                            <Text style={styles.itemDate}>{item.end}</Text>
                          ) : null}
                        </View>
                      </View>
                      {item.body ? (
                        <Text style={styles.itemBody}>{item.body}</Text>
                      ) : null}
                    </View>
                  );
                };

                return (
                  <>
                    <View wrap={false}>
                      <View style={styles.sectionTitleRow}>
                        <View
                          style={[
                            styles.sectionDot,
                            {
                              backgroundColor: accentColor,
                            },
                          ]}
                        />
                        <Text style={styles.sectionTitle}>Work history</Text>
                      </View>
                      {renderItem(first)}
                    </View>
                    {rest.map(renderItem)}
                  </>
                );
              })()}
            </View>
          ) : null}

          {hasEducation ? (
            <View style={styles.mainSection}>
              {(() => {
                const items = education
                  .map((item) => {
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

                    return {
                      id: item.id,
                      title,
                      subtitle,
                      start,
                      end,
                      body,
                    };
                  })
                  .filter(Boolean);

                if (items.length === 0) return null;

                const [first, ...rest] = items;

                const renderItem = (
                  item: {
                    id: string;
                    title: string;
                    subtitle: string;
                    body: string;
                    start: string;
                    end: string;
                  } | null,
                ) => {
                  if (!item) return null;
                  return (
                    <View key={item.id} style={styles.item} wrap={false}>
                      <View style={styles.itemHeader}>
                        <View style={styles.itemTitleRow}>
                          {item.title ? (
                            <Text style={styles.itemTitle}>{item.title}</Text>
                          ) : (
                            <Text style={styles.itemTitle} />
                          )}
                          {item.start ? (
                            <Text style={styles.itemDate}>{item.start}</Text>
                          ) : null}
                        </View>
                        <View style={styles.itemSubtitleRow}>
                          <Text
                            style={[
                              styles.itemSubtitle,
                              { color: accentColor },
                            ]}
                          >
                            {item.subtitle || " "}
                          </Text>
                          {item.end ? (
                            <Text style={styles.itemDate}>{item.end}</Text>
                          ) : null}
                        </View>
                      </View>
                      {item.body ? (
                        <Text style={styles.itemBody}>{item.body}</Text>
                      ) : null}
                    </View>
                  );
                };

                return (
                  <>
                    <View wrap={false}>
                      <View style={styles.sectionTitleRow}>
                        <View
                          style={[
                            styles.sectionDot,
                            {
                              backgroundColor: accentColor,
                            },
                          ]}
                        />
                        <Text style={styles.sectionTitle}>Education</Text>
                      </View>
                      {renderItem(first)}
                    </View>
                    {rest.map(renderItem)}
                  </>
                );
              })()}
            </View>
          ) : null}

          {hasCustomSections
            ? cleanedCustomSections.map((section) => (
                <View key={section.id} style={styles.mainSection} wrap={false}>
                  <View style={styles.sectionTitleRow}>
                    <View
                      style={[
                        styles.sectionDot,
                        {
                          backgroundColor: accentColor,
                        },
                      ]}
                    />
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  {section.description ? (
                    <Text style={styles.itemBody}>{section.description}</Text>
                  ) : null}
                </View>
              ))
            : null}
        </View>
      </Page>
    </Document>
  );
}
