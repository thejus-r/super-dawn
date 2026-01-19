import api from "@/shared/lib/api";
import { useQuery } from "@tanstack/react-query";

export type Property = {
  id: string;
  name: string;
  ownerName: string;
  ownerContact: string;
  monthlyRent: string;
  securityDeposit: string;
  authorId: string;
  organizationId: string | null;
  createAt: string;
  updatedAt: string;
};

type ListOfPropertyResponse = {
  properties: Property[];
};

export function usePropertyList() {
  return useQuery({
    queryKey: ["property-list"],
    queryFn: async () => {
      const response =
        await api.apiClient.get<ListOfPropertyResponse>("/property");
      console.log("query", response);
      return response.data;
    },
  });
}
