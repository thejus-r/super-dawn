import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { AppShell } from "@/shared/components/AppShell";
import { SideBar } from "@/shared/components/SideBar";

export const Route = createFileRoute("/_protected/$scopeId")({
  beforeLoad: ({ params }) => {
    if (params.scopeId === "personal") return;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = useParams({
    strict: false,
  });

  const currentScope = params.scopeId || "personal";

  return (
    <div className="flex grow bg-stone-100">
      <SideBar orgSlug={currentScope} />
      <AppShell>
        <Outlet />
      </AppShell>
    </div>
  );
}
