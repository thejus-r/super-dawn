import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import api from "@/shared/lib/api";
import type { ListOfPropertyResponse } from "../utils/types";

export function usePropertyList() {

  const { scopeId } = useParams({
    from: "/_protected/$scopeId"
  })

  console.log("usePropertyList", scopeId)

  return useQuery({
    queryKey: ["property-list", { scopeId }],
    queryFn: async () => {
      const response =
        await api.apiClient.get<ListOfPropertyResponse>("/property");
      return response.data;
    },
  });
}
