import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { AxiosInstance } from "axios";
import {
  type AuthContextType,
  AuthProvider,
  useAuthContext,
} from "./features/auth/components/AuthProvider";
import { useApiClient } from "./features/auth/hooks/use-api-client";
import { routeTree } from "./routeTree.gen";

export type AppRouterContext = {
  queryClient: QueryClient;
  authContext: AuthContextType;
  apiClient: AxiosInstance;
};

const router = createRouter({
  routeTree,
  context: {
    // biome-ignore lint/style/noNonNullAssertion: injected on initialization
    authContext: undefined!,
    // biome-ignore lint/style/noNonNullAssertion: injected on initialization
    queryClient: undefined!,
    // biome-ignore lint/style/noNonNullAssertion: injected on initialization
    apiClient: undefined!,
  },
});

const AppRouter = () => {
  const queryClient = useQueryClient();
  const authContext = useAuthContext();
  const apiClient = useApiClient();
  return (
    <RouterProvider
    router={router}
    context={{
      queryClient,
      authContext,
      apiClient
    }}
    />
  );
};

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
            <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
