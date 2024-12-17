import express, { Response, Request } from "express";
import patientService from "../services/patientService";
import { NewPatientEntry, NonSensitivePatientEntry, Params, PatientEntry } from "../types";
import { newPatientParser, errorMiddleware } from "../../middlewares";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get("/:id", (req: Request<Params>, res: Response<PatientEntry>) => {

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

router.use(errorMiddleware);

export default router;
