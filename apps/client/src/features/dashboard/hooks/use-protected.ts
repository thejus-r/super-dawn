import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/features/auth/hooks/use-api-client";

export function useProtected() {
  const client = useApiClient()

  return useQuery({
    queryKey: ["protected"],
    queryFn: () => client.get("organization/")
  })
}
