import { z } from "zod";

export const contactDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  email: z.string().email("Please enter a valid email address"),
  avatar: z.string().optional(),
  birthdate: z.string().optional(),
  postalCode: z.string().optional(),
  linkedIn: z.string().optional(),
  git: z.string().optional(),
  linkedInTitle: z.string().optional(),
  linkedInUrl: z.string().optional(),
  gitTitle: z.string().optional(),
  gitUrl: z.string().optional(),
  nationality: z.string().optional(),
  workPermit: z.string().optional(),
});

export type ContactDetailsFormData = z.infer<typeof contactDetailsSchema>;

export const workExperienceSchema = z.object({
  // Work experience fields will be added here
});

export const educationSchema = z.object({
  // Education fields will be added here
});

export const skillsSchema = z.object({
  // Skills fields will be added here
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
