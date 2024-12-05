import express, { Response } from "express";
import diagnosisService from '../services/diagnosisService';
import { Diagnosis } from "../types";

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosisService.getEntries());
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;