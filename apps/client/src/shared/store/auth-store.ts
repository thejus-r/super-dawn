import { create } from "zustand"

interface AuthState {
  accessToken: string | null | undefined;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: undefined,
  setAccessToken: (token) => set(() =>({accessToken: token }))
}))
