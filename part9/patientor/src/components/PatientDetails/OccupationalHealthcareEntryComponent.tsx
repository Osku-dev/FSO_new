import { OccupationalHealthcareEntry } from "../../types";

interface OccupationalHealthcareEntryProps {
  entry: OccupationalHealthcareEntry;
}

const OccupationalHealthcareEntryComponent = ({ entry }: OccupationalHealthcareEntryProps) => {
  return (
    <div>
      <p><strong>Employer:</strong> {entry.employerName}</p>
      {entry.sickLeave && (
        <div>
          <p><strong>Sick Leave:</strong></p>
          <p>Start Date: {entry.sickLeave.startDate}</p>
          <p>End Date: {entry.sickLeave.endDate}</p>
        </div>
      )}
    </div>
  );
};

export default OccupationalHealthcareEntryComponent;
