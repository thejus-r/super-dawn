import api from "@/shared/lib/api";
import type { UserWithMemberships, ValidateScopeResponse } from "../utils/types";

export async function fetchCurrentUser() {
  const response = await api.apiClient<UserWithMemberships>("identity/me");
  return response.data;
}

export async function validateScope(orgId?: string) {
  let baseURI = "identity/switch-org"
  if (orgId) {
    baseURI += `/${orgId}`
  }
  const response = await api.apiClient<ValidateScopeResponse>(baseURI)
  return response.data
}

export async function logoutUser() {
  await api.apiClient.get("identity/logout")
}
