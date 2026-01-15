import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AppRouterContext } from "@/app";

export const Route = createRootRouteWithContext<AppRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return <Outlet />;
}
