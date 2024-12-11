import { Gender } from "./types";
import { z } from "zod";

export const newPatientEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});
