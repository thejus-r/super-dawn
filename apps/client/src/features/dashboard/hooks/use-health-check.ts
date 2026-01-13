import { useApiClient } from "@/features/auth/hooks/use-api-client";
import { useQuery } from "@tanstack/react-query";

export function useHealthCheck() {
  const api = useApiClient();

  return useQuery({
    queryKey: ["health"],
    queryFn: () => api.get("/health"),
  });
}
