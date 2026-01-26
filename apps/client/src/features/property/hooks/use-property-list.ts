import { useQuery } from "@tanstack/react-query";
import api from "@/shared/lib/api";
import type { ListOfPropertyResponse } from "../utils/types";

export function usePropertyList() {
	return useQuery({
		queryKey: ["property-list"],
		queryFn: async () => {
			const response =
				await api.apiClient.get<ListOfPropertyResponse>("/property");
			return response.data;
		},
	});
}
