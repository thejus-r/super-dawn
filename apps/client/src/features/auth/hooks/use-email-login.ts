import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import api from "@/shared/lib/api";
import type { EmailLoginSchema } from "../utils/schema";

export function useEmailLogin() {

  const router = useRouter()
  const navigate = useNavigate()
  const search = useSearch({ from: '/_public' });
  return useMutation({
    mutationFn: async (value: EmailLoginSchema ) =>
    await api.apiClient.post("/identity/login", {
      method: "email",
      ...value,
    }),

    onSuccess: () => {

      if (search.redirect) {
        router.navigate({ to: search.redirect })
      } else {
        navigate({
          to: "/$scopeId/dashboard",
          params: {
            scopeId: "personal"
          }
        })
      }
    }
  });
}
