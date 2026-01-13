import { createFileRoute, Outlet } from "@tanstack/react-router";


// Handle Auth Check it, else kicks to login page
export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-dvh">
      <Outlet/>
    </div>
  );
}
