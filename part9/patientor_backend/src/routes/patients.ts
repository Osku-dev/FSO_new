import express, { Response } from "express";
import patientService from '../services/patientService';
import { NonSensitivePatientEntry } from "../types";

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;