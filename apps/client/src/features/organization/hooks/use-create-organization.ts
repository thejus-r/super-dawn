import api from "@/shared/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useCreateOrganization() {
  return useMutation({
    mutationFn: ({
      organizationName,
      organizationSlug,
    }: {
      organizationName: string;
      organizationSlug: string;
    }) => {
      return api.apiClient.post("/organization/create", {
        organizationName,
        organizationSlug,
      });
    },
  });
}
