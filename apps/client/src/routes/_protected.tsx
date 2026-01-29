import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { currentUserQueryOptions } from "@/features/auth/api/auth-query-options";

// Handle Auth Check it, else kicks to login page
export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context, location }) => {
    const { queryClient } = context
    try {
      await queryClient.ensureQueryData(currentUserQueryOptions())
    } catch {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      })
    }
  },
  pendingComponent: () => <div>Loading...</div>,
  component: () =>
    <div className="h-dvh flex">
      <Outlet />
    </div>
});
