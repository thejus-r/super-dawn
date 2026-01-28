import { useQuery } from "@tanstack/react-query";
import { currentUserQueryOptions } from "../api/auth-query-options";

export function useCurrentUser() {
  const queryOptions = currentUserQueryOptions()
  return useQuery(queryOptions);
}
