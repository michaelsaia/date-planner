import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  label: z.string().min(1).max(200),
});

export const budgetRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
}).refine((data) => data.max >= data.min, {
  message: "Max budget must be greater than or equal to min budget",
});

export const moodSchema = z.enum(["romantic", "adventurous", "low-key", "foodie", "active"]);

export const profileSchema = z.object({
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  budgetRange: budgetRangeSchema,
  homeLocation: locationSchema.nullable(),
});

export const filterSchema = z.object({
  moods: z.array(moodSchema).optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
});
