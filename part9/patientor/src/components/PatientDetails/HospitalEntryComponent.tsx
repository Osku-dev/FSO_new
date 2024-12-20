import { HospitalEntry } from "../../types";

interface HospitalEntryProps {
  entry: HospitalEntry;
}

const HospitalEntryComponent = ({ entry }: HospitalEntryProps) => {
  return (
    <div>
      {entry.discharge && (
        <div>
          <p><strong>Discharge Date:</strong> {entry.discharge.date}</p>
          <p><strong>Criteria:</strong> {entry.discharge.criteria}</p>
        </div>
      )}
    </div>
  );
};

export default HospitalEntryComponent;
