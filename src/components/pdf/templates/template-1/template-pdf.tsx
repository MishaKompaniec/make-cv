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
    width: 14,
    fontSize: 9,
    color: "#2B2B2B",
  },
  sidebarInfoText: {
    flex: 1,
    fontSize: 9,
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
  fullName?: string;
  email?: string;
};

export function TemplatePdf1({
  fullName = "Misha Kompaniec",
  email = "mishakompaniec@gmail.com",
}: Template1Props) {
  const fakeSummary =
    "Due to life circumstances in my country, I decided to change my profession and completely transform my life. I began developing skills as a frontend developer. Later, the project required basic backend knowledge, so I started to deepen my understanding of Node.js. I have been building websites using React for almost 3 years, and for the past six months, I have been using Node.js to handle backendrelated tasks.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar} />
          </View>

          <View style={styles.sidebarInfoRow}>
            <Text style={styles.sidebarInfoLabel}>☎</Text>
            <Text style={styles.sidebarInfoText}>+380660536975</Text>
          </View>
          <View style={styles.sidebarInfoRow}>
            <Text style={styles.sidebarInfoLabel}>✉</Text>
            <Text style={styles.sidebarInfoText}>{email}</Text>
          </View>
          <View style={styles.sidebarInfoRow}>
            <Text style={styles.sidebarInfoLabel}>⌂</Text>
            <Text style={styles.sidebarInfoText}>Pola de Siero</Text>
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Skills</Text>
            <Text style={styles.sidebarItem}>React</Text>
            <Text style={styles.sidebarItem}>Next</Text>
            <Text style={styles.sidebarItem}>Node.js</Text>
            <Text style={styles.sidebarItem}>Express</Text>
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Languages</Text>
            <Text style={styles.sidebarItem}>Ukrainian (native speaker)</Text>
            <Text style={styles.sidebarItem}>Russian (native speaker)</Text>
            <Text style={styles.sidebarItem}>English (B1)</Text>
            <Text style={styles.sidebarItem}>Spanish (A1)</Text>
          </View>
        </View>

        <View style={styles.main}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.jobTitle}>Fullstack Developer</Text>

          <Text style={styles.paragraph}>{fakeSummary}</Text>

          <Text style={styles.label}>Skills:</Text>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>React (TypeScript), Next</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Node.js + Express</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>MongoDB</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Redux, RTK</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              JSS, Styled-Components, Tailwind
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Prettier, ESLint, Husky</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Ant Design, Material UI</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Git/GitHub</Text>
          </View>

          <Text style={styles.label}>Contacts:</Text>
          <Text style={styles.paragraph}>Telegram: @MishaKompaniec</Text>
          <Text style={styles.paragraph}>
            GitHub: https://github.com/MishaKompaniec
          </Text>
          <Text style={styles.paragraph}>Instagram: misha_kompaniec</Text>
          <Text style={styles.paragraph}>
            Spanish phone number: +34657732224
          </Text>

          <View style={styles.mainSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Work history</Text>
            </View>

            <View style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Frontend developer</Text>
                <Text style={styles.itemDate}>
                  September 2022\nFebruary 2025
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>
                UniCode Software, Cherkassy
              </Text>
              <Text style={styles.itemBody}>
                Worked on a project for an American company related to health
                and safety. Also worked on the company's internal website,
                UniCode.
              </Text>
            </View>

            <View style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Full-stack developer</Text>
                <Text style={styles.itemDate}>February 2025\nCurrent</Text>
              </View>
              <Text style={styles.itemSubtitle}>
                UniCode Software, Cherkassy
              </Text>
              <Text style={styles.itemBody}>
                During my time working on the project, I started learning
                Node.js and taking on backend tasks.
              </Text>
            </View>
          </View>

          <View style={styles.mainSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Education</Text>
            </View>

            <View style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  JavaScript: Advanced Course
                </Text>
                <Text style={styles.itemDate}>April 2022\nJuly 2022</Text>
              </View>
              <Text style={styles.itemSubtitle}>ITVDN, Kiev</Text>
            </View>

            <View style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>React: Advanced Course</Text>
                <Text style={styles.itemDate}>July 2022\nSeptember 2022</Text>
              </View>
              <Text style={styles.itemSubtitle}>UniCode, Cherkassy</Text>
              <Text style={styles.itemBody}>
                Before working at the company, I completed the company's
                internal courses on React and Next.
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
