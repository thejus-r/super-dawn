import { useHealthCheck } from "../hooks/use-health-check";

export const HealthCheck = () => {
  const { data } = useHealthCheck();
  return (
    <div>
      Health Check
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
