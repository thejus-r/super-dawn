import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/shared/store/auth-store";
import { logoutUser } from "../api/auth-query-fns";
import { currentUserQueryOptions } from "../api/auth-query-options";

export function useLogout() {

  const { setAccessToken, setOrganizationId } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutUser,
    onSettled: async () => {

      // Set user to null
      setAccessToken(null)
      setOrganizationId(null)
      queryClient.setQueryData(currentUserQueryOptions().queryKey, undefined)

      // Clear caches
      queryClient.clear()

      // Navigate to /login
      await navigate({
        to: "/login",
      })

      // invalidate router cache as well
      router.invalidate()
    }
  })

}
