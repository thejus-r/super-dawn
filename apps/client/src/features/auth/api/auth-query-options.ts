import { queryOptions } from "@tanstack/react-query";
import { fetchCurrentUser, validateScope } from "./auth-query-fns";
import { authKeys } from "./auth-query-keys";

export const currentUserQueryOptions = () => {
  return queryOptions({
    queryFn: fetchCurrentUser,
    queryKey: [...authKeys.currentUser]
  })
}

export const scopeValidationQueryOptions = (orgId?: string) => {
  return queryOptions({
    queryFn: () => validateScope(orgId),
    queryKey: [...authKeys.scope, orgId],
    staleTime: 1000 * 60 * 5,
  })
}
