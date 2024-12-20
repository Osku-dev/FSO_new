import { Entry } from "../../types";
import HealthCheckEntryComponent from "./HealthCheckEntryComponent";
import HospitalEntryComponent from "./HospitalEntryComponent";
import OccupationalHealthcareEntryComponent from "./OccupationalHealthcareEntryComponent";

interface EntryDetailsProps {
  entry: Entry;
}

const assertNever = (value: never): never => {
    throw new Error(`Unhandled value: ${value}`);
  };
  

const EntryDetails = ({ entry }: EntryDetailsProps) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryComponent entry={entry} />;
    case "Hospital":
      return <HospitalEntryComponent entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryComponent entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
