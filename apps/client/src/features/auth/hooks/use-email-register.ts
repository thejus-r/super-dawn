import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import api from "@/shared/lib/api";
import type { EmailRegisterSchema } from "../utils/schema";

export function useEmailRegister() {
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: async (value: Omit<EmailRegisterSchema, "confirmPassword">) => {
      await api.apiClient.post("/identity/register", {
        method: "email",
        ...value
      });
    },
    onSuccess: () => {
      navigate({
        to: "/",
      });
    },
  });

  return mutate;
}
