import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { currentUserQueryOptions } from "@/features/auth/api/auth-query-options";

// Handle Auth Check it, else kicks to login page
export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {

    const { queryClient } = context
    try {
      await queryClient.ensureQueryData(currentUserQueryOptions())
    } catch {
      throw redirect({
        to: "/login"
      })
    }
  },
  pendingComponent: () => <div>Loading...</div>,
  component: () =>
    <div className="h-dvh flex">
      <Outlet />
    </div>
});
