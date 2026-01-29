import { create } from "zustand"

export interface AuthState {
  accessToken: string | null | undefined;
  setAccessToken: (token: string | null) => void;
  organizationId: string | null;
  setOrganizationId: (id: string| null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: undefined,
  setAccessToken: (token) => set(() => ({ accessToken: token })),
  organizationId: null,
  setOrganizationId: (id) => set(() => ({ organizationId: id }))
}))
