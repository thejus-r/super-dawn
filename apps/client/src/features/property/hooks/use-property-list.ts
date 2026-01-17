import api from "@/shared/lib/api";
import { useQuery } from "@tanstack/react-query";

export function usePropertyList() {
  return useQuery({
    queryKey: ["property-list"],
    queryFn: async () => {
      const response = await api.apiClient.get("/property");
      console.log("query", response);
      return response.data;
    },
  });
}
