import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AppRouterContext } from "@/app";

export const Route = createRootRouteWithContext<AppRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
  return <div className="h-full">
    <Outlet />
  </div>
}
