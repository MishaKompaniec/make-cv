import { z } from "zod";

const fullNameRegex = /^[\p{L}][\p{L} '\-]*$/u;
const cityRegex = /^[\p{L}][\p{L} \-]*$/u;
const nationalityRegex = /^[\p{L}][\p{L} ]*$/u;
const jobTitleRegex = /^[\p{L}0-9][\p{L}0-9 \-\/&.]*$/u;
const postalCodeRegex = /^[A-Za-z0-9]{2,10}$/;
const linkedInUrlRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;
const gitHubUrlRegex = /^(https?:\/\/)?(www\.)?github\.com\/.*$/;

const workExperienceJobTitleRegex = /^[\p{L}0-9][\p{L}0-9 \-\/&.]*$/u;
const workExperienceCompanyNameRegex = /^[\p{L}0-9][\p{L}0-9 &\-\.,']*$/u;
const workExperienceCityRegex = /^[\p{L}][\p{L} \-]*$/u;

const educationDiplomaRegex = /^[\p{L}0-9][\p{L}0-9 \-\/&.]*$/u;
const educationSchoolNameRegex = /^[\p{L}0-9][\p{L}0-9 &\-\.,']*$/u;
const educationSchoolLocationRegex = /^[\p{L}][\p{L} \-]*$/u;

export const contactDetailsSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(120, "Full name must be at most 120 characters")
      .regex(
        fullNameRegex,
        "Full name can contain only letters, spaces, hyphens, and apostrophes",
      ),
    jobTitle: z
      .string()
      .trim()
      .min(2, "Job title must be at least 2 characters")
      .max(70, "Job title must be at most 70 characters")
      .regex(
        jobTitleRegex,
        "Job title can contain letters, numbers, spaces, and - / & .",
      ),
    city: z
      .string()
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be at most 50 characters")
      .regex(cityRegex, "City can contain only letters, spaces, and hyphens"),
    phone: z.string().min(5, "Phone number must be at least 5 characters"),
    email: z.string().email("Please enter a valid email address"),
    avatar: z.string().optional(),
    birthdate: z.string().optional(),
    postalCode: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || postalCodeRegex.test(v),
        "Postal code must be 2 to 10 letters/digits",
      ),
    linkedIn: z.string().optional(),
    git: z.string().optional(),
    linkedInTitle: z.string().optional(),
    linkedInUrl: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || linkedInUrlRegex.test(v),
        "Please enter a valid LinkedIn URL",
      ),
    gitTitle: z.string().optional(),
    gitUrl: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || gitHubUrlRegex.test(v),
        "Please enter a valid GitHub URL",
      ),
    nationality: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || v.length <= 50,
        "Nationality must be at most 50 characters",
      )
      .refine(
        (v) => v === "" || nationalityRegex.test(v),
        "Nationality can contain only letters and spaces",
      ),
    workPermit: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const linkedInTitle = data.linkedInTitle?.trim() ?? "";
    const linkedInUrl = data.linkedInUrl?.trim() ?? "";
    const gitTitle = data.gitTitle?.trim() ?? "";
    const gitUrl = data.gitUrl?.trim() ?? "";

    if (linkedInTitle && !linkedInUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["linkedInUrl"],
        message: "LinkedIn URL is required when LinkedIn title is provided",
      });
    }

    if (linkedInUrl && !linkedInTitle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["linkedInTitle"],
        message: "LinkedIn title is required when LinkedIn URL is provided",
      });
    }

    if (gitTitle && !gitUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gitUrl"],
        message: "Git URL is required when Git title is provided",
      });
    }

    if (gitUrl && !gitTitle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gitTitle"],
        message: "Git title is required when Git URL is provided",
      });
    }
  });

export type ContactDetailsFormData = z.infer<typeof contactDetailsSchema>;

const monthYearSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(2100),
});

export const workExperienceItemSchema = z
  .object({
    id: z.string().min(1),
    jobTitle: z
      .string()
      .trim()
      .min(2, "Job title must be at least 2 characters")
      .max(70, "Job title must be at most 70 characters")
      .regex(
        workExperienceJobTitleRegex,
        "Job title can contain letters, numbers, spaces, and - / & .",
      ),
    companyName: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be at most 100 characters")
      .regex(
        workExperienceCompanyNameRegex,
        "Company name contains invalid characters",
      ),
    city: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || v.length <= 50,
        "City must be at most 50 characters",
      )
      .refine(
        (v) => v === "" || workExperienceCityRegex.test(v),
        "City can contain only letters, spaces, and hyphens",
      ),
    startDate: monthYearSchema,
    endDate: monthYearSchema.optional(),
    description: z
      .string()
      .max(1000, "Description must be at most 1000 characters"),
  })
  .superRefine((data, ctx) => {
    if (!data.endDate) return;
    const startIdx = data.startDate.year * 12 + data.startDate.month;
    const endIdx = data.endDate.year * 12 + data.endDate.month;
    if (endIdx <= startIdx) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }
  });

export const workExperienceSchema = z.array(workExperienceItemSchema);

export const educationItemSchema = z
  .object({
    id: z.string().min(1),
    diploma: z
      .string()
      .trim()
      .min(2, "Name of the diploma / study area must be at least 2 characters")
      .max(
        100,
        "Name of the diploma / study area must be at most 100 characters",
      )
      .regex(
        educationDiplomaRegex,
        "Name of the diploma / study area contains invalid characters",
      ),
    schoolName: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || v.length <= 120,
        "School name must be at most 120 characters",
      )
      .refine(
        (v) => v === "" || educationSchoolNameRegex.test(v),
        "School name contains invalid characters",
      )
      .optional(),
    schoolLocation: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || v.length <= 50,
        "School location must be at most 50 characters",
      )
      .refine(
        (v) => v === "" || educationSchoolLocationRegex.test(v),
        "School location can contain only letters, spaces, and hyphens",
      )
      .optional(),
    startDate: monthYearSchema.optional(),
    endDate: monthYearSchema.optional(),
    description: z
      .string()
      .refine(
        (v) => v === "" || v.length <= 1000,
        "Description must be at most 1000 characters",
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.endDate || !data.startDate) return;
    const startIdx = data.startDate.year * 12 + data.startDate.month;
    const endIdx = data.endDate.year * 12 + data.endDate.month;
    if (endIdx <= startIdx) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }
  });

export const educationSchema = z.array(educationItemSchema);

export const skillsItemSchema = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, "Skill title is required")
    .max(25, "Skill title is too long"),
});

export const skillsSchema = z.array(skillsItemSchema);

export const languageItemSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(1, "Language name is required")
    .max(25, "Language name is too long"),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "Native"]),
});

export const interestItemSchema = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, "Interest is required")
    .max(25, "Interest is too long"),
});

export const customSectionItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Section title is required"),
  description: z.string(),
});

export const summarySchema = z.object({
  // Summary fields will be added here
});

export const otherSectionsSchema = z.object({
  // Other sections fields will be added here
});

export const finalizeSchema = z.object({
  // Finalize fields will be added here
});

export const cvSchema = z.object({
  contactDetails: contactDetailsSchema,
  workExperience: workExperienceSchema,
  education: educationSchema,
  skills: skillsSchema,
  summary: summarySchema,
  otherSections: otherSectionsSchema,
  finalize: finalizeSchema,
});

export type CvFormData = z.infer<typeof cvSchema>;
