/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { Response } from "express";
import patientService from "../services/patientService";
import { NonSensitivePatientEntry } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post("/", (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  const addedEntry = patientService.addPatient({
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  });
  res.json(addedEntry);
});

export default router;
