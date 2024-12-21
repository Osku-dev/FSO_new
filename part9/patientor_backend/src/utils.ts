import { Gender, HealthCheckRating } from "./types";
import { z } from "zod";

export const newPatientEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string().refine(
    (date) => !isNaN(Date.parse(date)), 
    { message: "Invalid date format" }
  ),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z
    .object({
      date: z.string().refine(
        (date) => !isNaN(Date.parse(date)), 
        { message: "Invalid date format" }
      ),
      criteria: z.string(),
    })
    .optional(),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)), 
        { message: "Invalid date format" }
      ),
      endDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)), 
        { message: "Invalid date format" }
      ),
    })
    .optional(),
});

export const newEntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);
