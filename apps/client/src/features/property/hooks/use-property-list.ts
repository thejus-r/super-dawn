import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import api from "@/shared/lib/api";
import { flattenFilters } from "../utils/healpers";
import type { ListOfPropertyResponse } from "../utils/types";
import { usePropertyFilters } from "./use-property-filter";

export function usePropertyList() {

  const { filters } = usePropertyFilters()

  const { scopeId } = useParams({
    from: "/_protected/$scopeId"
  })

  const finalParams = useMemo(() => flattenFilters(filters), [filters]);

  console.log("params", finalParams)

  return useQuery({
    queryKey: ["property-list", scopeId, finalParams],
    queryFn: async () => {
      const response =
        await api.apiClient.get<ListOfPropertyResponse>("/property", {
          params: finalParams
        });

      return {
        properties: response.data.data,
        meta: response.data.meta
      }
    },
  });
}
