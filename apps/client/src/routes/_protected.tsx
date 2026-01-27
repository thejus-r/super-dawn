import { createFileRoute, Outlet } from "@tanstack/react-router";

// Handle Auth Check it, else kicks to login page
export const Route = createFileRoute("/_protected")({
  pendingComponent: () => <div>Loading...</div>,
  component: () =>
    <div className="h-dvh flex">
      <Outlet />
    </div>
});
