import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Diagnosis, Patient } from "../../types";
import { getPatient, getDiagnoses } from "../../services/patients";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople"; 
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    getDiagnoses().then((data) => {
      setDiagnoses(data);
    });
  }, []);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      const fetchedPatient = await getPatient(id);
      setPatient(fetchedPatient);
    };

    fetchPatient();
  }, [id]);

  if (!patient) {
    return <p>Loading patient data...</p>;
  }

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return <MaleIcon style={{ color: "blue" }} />;
      case "female":
        return <FemaleIcon style={{ color: "red" }} />;
      case "other":
        return <EmojiPeopleIcon  style={{ color: "purple" }} />;
      default:
        return <HelpOutlineIcon style={{ color: "gray" }} />;
    }
  };

  return (
    <div>
      <h1>{patient.name} {getGenderIcon(patient.gender)}</h1>
      <p>
        <strong>SSN:</strong> {patient.ssn}
      </p>
      <p>
        <strong>Occupation:</strong> {patient.occupation}
      </p>
      <h2>entries</h2>
      <ul>
  {patient.entries.map((entry) => (
    <li key={entry.id}>
      <p>{entry.date} {entry.description}</p>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => {
            const diagnosis = diagnoses.find((d) => d.code === code);
            return (
              <li key={code}>
                <strong>{code}:</strong> {diagnosis ? diagnosis.name : "Unknown Diagnosis"}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  ))}
</ul>
    </div>
  );
};

export default PatientDetails;
