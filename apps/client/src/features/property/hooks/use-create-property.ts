import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/lib/api";
import type { CreateProperty } from "../utils/schema";

export function useCreateProperty() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateProperty) => {
			const response = await api.apiClient.post("property", payload);
			return response.data;
		},

		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["property-list"],
			});
		},
	});
}
