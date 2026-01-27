import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/lib/api";
import type { CreateProperty } from "../utils/schema";

export function useUpdateProperty() {
	const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: CreateProperty }) => {
			const response = await api.apiClient.patch(`/property/${id}`, payload);
			return response.data;
		},

		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["property-list"],
			});
		},
	});
}
