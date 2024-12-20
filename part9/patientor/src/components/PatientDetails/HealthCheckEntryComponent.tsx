import { HealthCheckEntry, HealthCheckRating } from "../../types";

interface HealthCheckEntryProps {
  entry: HealthCheckEntry;
}

const HealthCheckEntryComponent = ({ entry }: HealthCheckEntryProps) => {
  const healthCheckRatingText = (rating: HealthCheckRating) => {
    switch (rating) {
      case HealthCheckRating.Healthy:
        return "Healthy";
      case HealthCheckRating.LowRisk:
        return "Low Risk";
      case HealthCheckRating.HighRisk:
        return "High Risk";
      case HealthCheckRating.CriticalRisk:
        return "Critical Risk";
      default:
        return "Unknown Rating";
    }
  };

  return (
    <div>
      <p><strong>Health Check Rating:</strong> {healthCheckRatingText(entry.healthCheckRating)}</p>
    </div>
  );
};

export default HealthCheckEntryComponent;
