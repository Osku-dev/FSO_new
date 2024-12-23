import React, { useState } from "react";
import { Diagnosis, Entry, HospitalEntry, NewEntry } from "../../types";
import { createEntry } from "../../services/patients";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  Box,
  Alert,
} from "@mui/material";

interface HospitalEntryFormProps {
  diagnoses: Diagnosis[];
  patientId: string;
  onNewEntry: (entry: Entry) => void;
}

const HospitalEntryForm = ({ diagnoses, patientId, onNewEntry }: HospitalEntryFormProps) => {
  const [formData, setFormData] = useState<Omit<HospitalEntry, "id">>({
    type: "Hospital",
    date: "",
    specialist: "",
    description: "",
    discharge: {
      date: "",
      criteria: "",
    },
    diagnosisCodes: [],
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const newEntry: NewEntry = { ...formData };
      const createdEntry = await createEntry(newEntry, patientId);

      onNewEntry(createdEntry);

      setFormData({
        type: "Hospital",
        date: "",
        specialist: "",
        description: "",
        discharge: {
          date: "",
          criteria: "",
        },
        diagnosisCodes: [],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#f9f9f9",
        marginBottom: "20px",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add Hospital Entry
      </Typography>

      {error && (
        <Box marginBottom={2}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Form Fields */}
      <FormControl fullWidth margin="normal">
        <TextField
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Specialist"
          value={formData.specialist}
          onChange={(e) => handleChange("specialist", e.target.value)}
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          multiline
          rows={4}
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Discharge Date"
          type="date"
          value={formData.discharge?.date || ""}
          onChange={(e) =>
            handleChange("discharge", {
              ...formData.discharge || { date: "", criteria: "" },
              date: e.target.value,
            })
          }
          InputLabelProps={{ shrink: true }}
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Discharge Criteria"
          value={formData.discharge?.criteria || ""}
          onChange={(e) =>
            handleChange("discharge", {
                ...formData.discharge || { date: "", criteria: "" },
              criteria: e.target.value,
            })
          }
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          multiple
          value={formData.diagnosisCodes || []}
          onChange={(e) =>
            handleChange(
              "diagnosisCodes",
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            )
          }
          input={<OutlinedInput label="Diagnosis Codes" />}
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              <Checkbox checked={Boolean((formData.diagnosisCodes || []).includes(diagnosis.code))} />
              <ListItemText primary={`${diagnosis.code} - ${diagnosis.name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: "16px" }}
      >
        Add Entry
      </Button>
    </Box>
  );
};

export default HospitalEntryForm;
