import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../../types";
import { getPatient } from "../../services/patients";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople"; 
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

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
    </div>
  );
};

export default PatientDetails;
