import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { type AuthState, useAuthStore } from "./shared/store/auth-store";

export type AppRouterContext = {
	queryClient: QueryClient;
	authStore: AuthState;
};

const router = createRouter({
	routeTree,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: injected on initialization
		queryClient: undefined!,
		// biome-ignore lint/style/noNonNullAssertion: injected on initialization
    authStore: undefined!
	},
});

const AppRouter = () => {
	const queryClient = useQueryClient();
	const authState = useAuthStore()
	return (
		<RouterProvider
			router={router}
			context={{
        queryClient,
				authStore: authState
			}}
		/>
	);
};

export const App = () => {
  const queryClient = new QueryClient();


	return (
		<QueryClientProvider client={queryClient}>
			<AppRouter />
		</QueryClientProvider>
	);
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
