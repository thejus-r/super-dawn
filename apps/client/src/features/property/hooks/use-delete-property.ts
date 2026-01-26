import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/lib/api";

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  const mutate = useMutation({
    mutationFn: async (id: string) => {
      await api.apiClient.delete(`/property/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-list"],
      })
    }
  })

  return mutate
}
