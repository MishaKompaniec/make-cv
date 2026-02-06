"use client";

import styles from "./template-preview.module.scss";
import {
  type ContactDetailsPreviewData,
  type WorkExperiencePreviewItem,
  formatMonthYear,
  makeGhostClass,
  makeRenderLine,
  makeRenderText,
  makeSidebarIcons,
  resolveAccentColor,
} from "../template-preview-utils";

interface TemplatePreview1Props {
  sidebarColor?: string;
}

export function TemplatePreview1({ sidebarColor }: TemplatePreview1Props) {
  const accentColor = resolveAccentColor(sidebarColor);

  const ghostClass = makeGhostClass(styles);
  const renderLine = makeRenderLine(ghostClass, styles);
  const renderText = makeRenderText(ghostClass);

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

  const placeholderContactDetails: ContactDetailsPreviewData = {
    fullName: "John Doe",
    jobTitle: "Fullstack Developer",
    phone: "+1 234 567 890",
    email: "email@example.com",
    city: "City, Country",
    birthdate: "01/01/1990",
    postalCode: "12345",
    nationality: "Nationality",
    workPermit: "Work permit",
    linkedIn: "linkedin.com/in/johndoe",
    git: "github.com/johndoe",
  };

  const dataContactDetails = placeholderContactDetails;

  const fullName = dataContactDetails.fullName ?? "";
  const jobTitle = dataContactDetails.jobTitle ?? "";
  const phone = dataContactDetails.phone ?? "";
  const email = dataContactDetails.email ?? "";
  const city = dataContactDetails.city ?? "";
  const birthdate = dataContactDetails.birthdate ?? "";
  const postalCode = dataContactDetails.postalCode ?? "";
  const nationality = dataContactDetails.nationality ?? "";
  const workPermit = dataContactDetails.workPermit ?? "";
  const linkedIn = dataContactDetails.linkedIn ?? "";
  const git = dataContactDetails.git ?? "";

  const addressLine =
    postalCode || city ? `${postalCode ? `${postalCode}, ` : ""}${city}` : "";

  const sidebarSkill1 = "JavaScript, TypeScript";
  const sidebarSkill2 = "React, Next.js, Node.js";
  const sidebarSkill3 = "PostgreSQL, MongoDB, Docker";

  const language1 = "Ukrainian (Native)";
  const language2 = "English (B2)";
  const language3 = "Spanish (B1)";

  const interest1 = "Snowboarding";
  const interest2 = "Surfing";

  const summary =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

  const workTitle = "Work history";
  const workItems = [
    {
      id: "p1",
      jobTitle: "Senior Full Stack Developer",
      companyName: "Tech Solutions Inc.",
      city: "San Francisco, CA",
      startDate: { month: 3, year: 2021 },
      endDate: { month: 8, year: 2024 },
      description:
        "Led development of microservices architecture using Node.js and React. Implemented CI/CD pipelines and improved application performance by 40%. Mentored junior developers and conducted code reviews.",
    },
    {
      id: "p2",
      jobTitle: "Frontend Developer",
      companyName: "Digital Agency Pro",
      city: "New York, NY",
      startDate: { month: 6, year: 2019 },
      endDate: { month: 2, year: 2021 },
      description:
        "Developed responsive web applications using React and TypeScript. Collaborated with UX team to implement pixel-perfect designs. Optimized bundle sizes and improved page load times.",
    },
    {
      id: "p3",
      jobTitle: "Junior Web Developer",
      companyName: "StartUp Hub",
      city: "Kyiv, Ukraine",
      startDate: { month: 9, year: 2017 },
      endDate: { month: 5, year: 2019 },
      description:
        "Built responsive websites using HTML, CSS, JavaScript. Worked with WordPress and custom PHP development. Participated in agile development process and daily standups.",
    },
    {
      id: "p4",
      jobTitle: "Web Development Intern",
      companyName: "Creative Studio",
      city: "Lviv, Ukraine",
      startDate: { month: 6, year: 2017 },
      endDate: { month: 8, year: 2017 },
      description:
        "Assisted senior developers with website maintenance and updates. Gained experience with version control, client communication, and project management tools.",
    },
  ];

  const dataWorkItems = workItems;

  const educationTitle = "Education";
  const eduItem1Title = "Bachelor of Computer Science";
  const eduItem1StartDate = "September 2015";
  const eduItem1EndDate = "June 2019";
  const eduItem1Subtitle = "National Technical University of Ukraine, Kyiv";
  const eduItem2Title = "Full Stack Web Development Bootcamp";
  const eduItem2StartDate = "January 2020";
  const eduItem2EndDate = "April 2020";
  const eduItem2Subtitle = "Code Academy, Online";
  const eduItem2Body =
    "Intensive 16-week program covering modern web development technologies including React, Node.js, databases, and deployment strategies.";
  const eduItem3Title = "Advanced React & Redux Certification";
  const eduItem3StartDate = "October 2020";
  const eduItem3EndDate = "December 2020";
  const eduItem3Subtitle = "Udemy, Online";
  const eduItem3Body =
    "Deep dive into React ecosystem, advanced state management, performance optimization, and testing strategies.";
  const eduItem4Title = "AWS Cloud Practitioner";
  const eduItem4StartDate = "March 2021";
  const eduItem4EndDate = "May 2021";
  const eduItem4Subtitle = "Amazon Web Services, Online";
  const eduItem4Body =
    "Comprehensive understanding of AWS cloud services, architecture best practices, and cloud security fundamentals.";

  return (
    <div
      className={styles.preview}
      style={{
        ["--accent-color" as any]: accentColor,
      }}
    >
      <div className={styles.sidebar} style={{ backgroundColor: sidebarColor }}>
        <div className={styles.avatar} />
        {renderLine(IconPhone, phone)}
        {renderLine(IconEmail, email)}
        {renderLine(IconLocation, addressLine)}
        {renderLine(IconBirthday, birthdate)}
        {renderLine(IconFlag, nationality)}
        {renderLine(IconDocument, workPermit)}
        <div className={styles.contactSpacer} />
        {renderLine(IconLinkedIn, linkedIn)}
        {renderLine(IconGitHub, git)}

        <div className={styles.section}>
          {renderText("div", styles.sectionTitle, "Skills")}
          {renderText("div", styles.item, sidebarSkill1)}
          {renderText("div", styles.item, sidebarSkill2)}
          {renderText("div", styles.item, sidebarSkill3)}
        </div>

        <div className={styles.section}>
          {renderText("div", styles.sectionTitle, "Languages")}
          {renderText("div", styles.item, language1)}
          {renderText("div", styles.item, language2)}
          {renderText("div", styles.item, language3)}
        </div>

        <div className={styles.section}>
          {renderText("div", styles.sectionTitle, "Interests")}
          {renderText("div", styles.item, interest2)}
          {renderText("div", styles.item, interest1)}
        </div>
      </div>

      <div className={styles.main}>
        {renderText("div", styles.name, fullName)}
        {renderText("div", styles.jobTitle, jobTitle)}

        {renderText("div", styles.summary, summary)}

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            {renderText("div", styles.sectionTitle, workTitle)}
          </div>
          {dataWorkItems.map((item: WorkExperiencePreviewItem) => {
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
                    {renderText("div", styles.workTitle, title)}
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
            {renderText("div", styles.sectionTitle, educationTitle)}
          </div>
          <div className={styles.workItem}>
            <div className={styles.workHeader}>
              <div>
                {renderText("div", styles.workTitle, eduItem1Title)}
                {renderText("div", styles.workSubtitle, eduItem1Subtitle)}
              </div>
              <div className={styles.workDate}>
                <div>{eduItem1StartDate}</div>
                <div>{eduItem1EndDate}</div>
              </div>
            </div>
          </div>
          <div className={styles.workItem}>
            <div className={styles.workHeader}>
              <div>
                {renderText("div", styles.workTitle, eduItem2Title)}
                {renderText("div", styles.workSubtitle, eduItem2Subtitle)}
              </div>
              <div className={styles.workDate}>
                <div>{eduItem2StartDate}</div>
                <div>{eduItem2EndDate}</div>
              </div>
            </div>
            {renderText("div", styles.workBody, eduItem2Body)}
          </div>
          <div className={styles.workItem}>
            <div className={styles.workHeader}>
              <div>
                {renderText("div", styles.workTitle, eduItem3Title)}
                {renderText("div", styles.workSubtitle, eduItem3Subtitle)}
              </div>
              <div className={styles.workDate}>
                <div>{eduItem3StartDate}</div>
                <div>{eduItem3EndDate}</div>
              </div>
            </div>
            {renderText("div", styles.workBody, eduItem3Body)}
          </div>
          <div className={styles.workItem}>
            <div className={styles.workHeader}>
              <div>
                {renderText("div", styles.workTitle, eduItem4Title)}
                {renderText("div", styles.workSubtitle, eduItem4Subtitle)}
              </div>
              <div className={styles.workDate}>
                <div>{eduItem4StartDate}</div>
                <div>{eduItem4EndDate}</div>
              </div>
            </div>
            {renderText("div", styles.workBody, eduItem4Body)}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDot} />
            {renderText("div", styles.sectionTitle, "Custom section")}
          </div>
          <div className={styles.workBody}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </div>
        </div>
      </div>
    </div>
  );
}
