import { useApiClient } from "./use-api-client";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const api = useApiClient();

  return useMutation({
    mutationFn: () =>
      api.post("/identity/login", {
        method: "email",
        email: "thejus@mail.com",
        password: "12345678",
        firstName: "Thejus",
        lastName: "Rajendran",
      }),

    onSuccess: () => {
      console.log("good request");
    },
  });
}
