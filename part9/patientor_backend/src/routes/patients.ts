import express, { Response, Request } from "express";
import patientService from "../services/patientService";
import { Entry, NewEntry, NewPatientEntry, NonSensitivePatientEntry,PatientEntry } from "../types";
import { newPatientParser, errorMiddleware, newEntryParser } from "../../middlewares";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get("/:id", (req: Request<{ id: string }>, res: Response<PatientEntry>) => {

  const { id } = req.params;
  res.send(patientService.getEntry(id));
});

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatientEntry>,
    res: Response<NonSensitivePatientEntry>
  ) => {
    const addedEntry = patientService.addPatient(req.body);
    res.json(addedEntry);
  }
);

router.post(
  "/:id/entries",
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    const { id } = req.params;
      const addedEntry = patientService.addEntry(id, req.body);
      res.status(201).json(addedEntry);
    
  }
);

router.use(errorMiddleware);

export default router;
