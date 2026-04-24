import { z } from "zod";

export const customTripSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  phone: z.string().min(6),
  destination: z.string().optional().default(""),
  budget: z.string().optional().default(""),
  travelStart: z.string().optional(),
  travelEnd: z.string().optional(),
  numTravelers: z.coerce.number().min(1).max(200),
  dietary: z.string().optional().default(""),
  activityLevel: z.string().min(1),
  notes: z.string().optional().default(""),
});

export const corporateLeadSchema = z.object({
  company: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  message: z.string().optional().default(""),
  teamSize: z.string().optional().default(""),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const packageFormSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  destination: z.string().min(1),
  city: z.string().min(1),
  coverImage: z.string().url().or(z.string().min(1)),
  shortSummary: z.string().min(10),
  priceFrom: z.coerce.number().min(0),
  durationDays: z.coerce.number().min(1),
  groupOrSolo: z.enum(["group", "solo", "both"]),
  vibe: z.enum(["adventure", "relaxation", "mixed", "cultural"]),
  minBudget: z.coerce.number().optional().default(0),
  maxBudget: z.coerce.number().optional().default(0),
});
