import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";

export type AuthContextType = {
	user: null | string;
	accessToken: null | string;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
	isAuthenticated: boolean
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error(
			"useAuthContext should be used inside a AuthProvider component",
		);
	}

	return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const isAuthenticated = !!accessToken

	const value = useMemo(
		() => ({
			user,
			accessToken,
      setAccessToken,
      isAuthenticated
		}),
		[user, accessToken, isAuthenticated],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
