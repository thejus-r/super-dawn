import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import api from "@/shared/lib/api";
import type { EmailLoginSchema } from "../utils/schema";

export function useEmailLogin() {

  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (value: EmailLoginSchema ) =>
    await api.apiClient.post("/identity/login", {
      method: "email",
      ...value,
    }),

    onSuccess: () => {
      navigate({
        to: "/"
      })
    }
  });
}
