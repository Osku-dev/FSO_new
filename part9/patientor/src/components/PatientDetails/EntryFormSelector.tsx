import { useState } from "react";
import { Diagnosis, Entry } from "../../types";
import HealthCheckEntryForm from "./HealthCheckEntryForm";
import HospitalEntryForm from "./HospitalEntryForm";
import OccupationalHealthcareEntryForm from "./OccupationalHealthcareEntryForm";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

interface EntryFormSelectorProps {
  diagnoses: Diagnosis[];
  patientId: string;
  onNewEntry: (entry: Entry) => void;
}

const EntryFormSelector = ({
  diagnoses,
  patientId,
  onNewEntry,
}: EntryFormSelectorProps) => {
  const [entryType, setEntryType] = useState<
    "HealthCheck" | "Hospital" | "OccupationalHealthcare" | ""
  >("");

  const assertNever = (value: never): never => {
    throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
  };

  const renderEntryForm = () => {
    switch (entryType) {
      case "HealthCheck":
        return (
          <HealthCheckEntryForm
            diagnoses={diagnoses}
            patientId={patientId}
            onNewEntry={onNewEntry}
          />
        );
      case "Hospital":
        return (
          <HospitalEntryForm
            diagnoses={diagnoses}
            patientId={patientId}
            onNewEntry={onNewEntry}
          />
        );
      case "OccupationalHealthcare":
        return (
          <OccupationalHealthcareEntryForm
            diagnoses={diagnoses}
            patientId={patientId}
            onNewEntry={onNewEntry}
          />
        );
      case "":
        return null;
      default:
        return assertNever(entryType);
    }
  };

  return (
    <Box
      sx={{ padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <Typography variant="h6" gutterBottom>
        Select Entry Type
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="entry-type-select-label">Entry Type</InputLabel>
        <Select
          labelId="entry-type-select-label"
          value={entryType}
          onChange={(e) =>
            setEntryType(
              e.target.value as
                | "HealthCheck"
                | "Hospital"
                | "OccupationalHealthcare"
            )
          }
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            Occupational Healthcare
          </MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ marginTop: "16px" }}>{renderEntryForm()}</Box>
    </Box>
  );
};

export default EntryFormSelector;
