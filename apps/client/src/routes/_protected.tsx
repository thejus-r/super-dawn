import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import api from "@/shared/lib/api";


// Handle Auth Check it, else kicks to login page
export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context

    try {
      const res = await queryClient.ensureQueryData({
        queryKey: ["user"],
        queryFn: async () => {
          return await api.apiClient.get("/identity/me")
        }
      })
    } catch {
      throw redirect({
        to: "/login"
      })
    }
  },
  pendingComponent: () => <div>Loading...</div>,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-dvh">
      <Outlet/>
    </div>
  );
}
