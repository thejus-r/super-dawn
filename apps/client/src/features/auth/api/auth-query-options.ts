import { queryOptions } from "@tanstack/react-query";
import { fetchCurrentUser } from "./auth-query-fns";
import { user } from "./auth-query-keys";

export const currentUserQueryOptions = () => {
  return queryOptions({
    queryFn: fetchCurrentUser,
    queryKey: [...user.current]
  })
}
