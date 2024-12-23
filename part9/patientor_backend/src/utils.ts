import { Gender, HealthCheckRating } from "./types";
import { z } from "zod";

export const newPatientEntrySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date of birth must be in the format YYYY-MM-DD" }),
  ssn: z.string().min(1, { message: "SSN is required" }),
  gender: z.nativeEnum(Gender, { message: "Gender must be one of the following values: Male, Female, Other" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
});

const BaseEntrySchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format. Please enter a valid date." }),
  specialist: z.string().min(1, { message: "Specialist's name is required" }),
  diagnosisCodes: z.array(z.string(), { message: "Diagnosis codes must be an array of strings" }).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating, {
    message: "Health Check Rating must be one of the following values: 0 (Healthy), 1 (Low Risk), 2 (High Risk), 3 (Critical Risk)",
  }),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z
    .object({
      date: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid discharge date format. Please enter a valid date." }),
      criteria: z.string().min(1, { message: "Discharge criteria is required" }),
    })
    .optional(),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string().min(1, { message: "Employer name is required" }),
  sickLeave: z
    .object({
      startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date format. Please enter a valid date." }),
      endDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date format. Please enter a valid date." }),
    })
    .optional(),
});

export const newEntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);
