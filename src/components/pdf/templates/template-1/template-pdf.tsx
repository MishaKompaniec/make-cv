import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

export const TEMPLATE_1_ID = "template-1-v1";

export const TEMPLATE_1_COLORS = [
  { name: "beige", value: "#EAE3D9" },
  { name: "light-blue", value: "#E8F4F8" },
  { name: "light-gray", value: "#F5F5F5" },
  { name: "light-green", value: "#E8F5E8" },
  { name: "light-purple", value: "#F0EBF8" },
];

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  sidebar: {
    width: "30%",
    backgroundColor: "#EAE3D9",
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
    color: "#B59D7B",
    marginBottom: 14,
  },
  paragraph: {
    fontSize: 9,
    color: "#2B2B2B",
    lineHeight: 1.5,
    marginBottom: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2B2B2B",
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bulletDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "#2B2B2B",
    marginTop: 4,
    marginRight: 6,
  },
  bulletText: {
    fontSize: 9,
    color: "#2B2B2B",
    lineHeight: 1.4,
  },

  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "#C5B08F",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "#EAE3D9",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#CFCFCF",
  },
  sidebarInfoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  sidebarInfoLabel: {
    width: 26,
    fontSize: 7,
    fontWeight: 700,
    color: "#2B2B2B",
  },
  sidebarInfoText: {
    flex: 1,
    fontSize: 8,
    color: "#2B2B2B",
  },
  sidebarSection: {
    marginTop: 16,
  },
  sidebarSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111111",
    marginBottom: 10,
  },
  sidebarItem: {
    fontSize: 9,
    color: "#2B2B2B",
    marginBottom: 6,
  },

  mainSection: {
    marginTop: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#B59D7B",
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
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
  itemSubtitle: {
    fontSize: 9,
    color: "#B59D7B",
    marginBottom: 4,
  },
  itemBody: {
    fontSize: 9,
    color: "#2B2B2B",
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
};

export function TemplatePdf1({
  sidebarColor = "#EAE3D9",
  contactDetails,
  workExperience = [],
}: Template1Props) {
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

  const hasHeader = Boolean(fullName || jobTitle);
  const hasWorkExperience = workExperience.some(
    (w) => w.jobTitle?.trim() || w.companyName?.trim() || w.description?.trim(),
  );

  const renderSidebarRow = (icon: string, value: string) => {
    if (!value) return null;
    return (
      <View style={styles.sidebarInfoRow}>
        <Text style={styles.sidebarInfoLabel}>{icon}</Text>
        <Text style={styles.sidebarInfoText}>{value}</Text>
      </View>
    );
  };

  const wrapUrl = (value: string) => value.replaceAll("/", "/ ");
  const linkedInSafe = linkedIn ? wrapUrl(linkedIn) : "";
  const gitSafe = git ? wrapUrl(git) : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.sidebar, { backgroundColor: sidebarColor }]}>
          {hasSidebarInfo ? (
            <>
              {renderSidebarRow("TEL", phone)}
              {renderSidebarRow("MAIL", email)}
              {renderSidebarRow("ADDR", addressLine)}
              {renderSidebarRow("BORN", birthdate)}
              {renderSidebarRow("NAT", nationality)}
              {renderSidebarRow("PERM", workPermit)}
              {renderSidebarRow("in", linkedInSafe)}
              {renderSidebarRow("GIT", gitSafe)}
            </>
          ) : null}
        </View>

        <View style={styles.main}>
          {hasHeader ? (
            <>
              {fullName ? <Text style={styles.name}>{fullName}</Text> : null}
              {jobTitle ? (
                <Text style={styles.jobTitle}>{jobTitle}</Text>
              ) : null}
            </>
          ) : null}

          {hasWorkExperience ? (
            <View style={styles.mainSection}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionDot} />
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
                const dateText = start || end ? `${start}\n${end}` : "";

                const subtitle = itemCity ? `${company}, ${itemCity}` : company;
                const hasItem = Boolean(title || subtitle || body || dateText);
                if (!hasItem) return null;

                return (
                  <View key={item.id} style={styles.item}>
                    <View style={styles.itemHeader}>
                      {title ? (
                        <Text style={styles.itemTitle}>{title}</Text>
                      ) : (
                        <Text style={styles.itemTitle} />
                      )}
                      {dateText ? (
                        <Text style={styles.itemDate}>{dateText}</Text>
                      ) : null}
                    </View>
                    {subtitle ? (
                      <Text style={styles.itemSubtitle}>{subtitle}</Text>
                    ) : null}
                    {body ? <Text style={styles.itemBody}>{body}</Text> : null}
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
