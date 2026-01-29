import {
  createFileRoute,
  Outlet,
  redirect,
  useParams,
} from "@tanstack/react-router";
import { currentUserQueryOptions, scopeValidationQueryOptions } from "@/features/auth/api/auth-query-options";
import { AppShell } from "@/shared/components/AppShell";
import { SideBar } from "@/shared/components/SideBar";

export const Route = createFileRoute("/_protected/$scopeId")({
  beforeLoad: async ({ params, context, location }) => {
    console.log("ran scopeId beforeload")
    const { authStore, queryClient } = context;

    const isPersonal = params.scopeId === "personal";
    let scope: string | undefined;

    try {
      if (!isPersonal) {
        const currUser = await queryClient.ensureQueryData(
          currentUserQueryOptions(),
        );
        const membership = currUser.memberships.find(
          (membership) => membership.organization.slug === params.scopeId,
        );
        scope = membership?.organization.id;
      }

      const result = await queryClient.ensureQueryData(scopeValidationQueryOptions(scope))
      if (result.accessToken !== authStore.accessToken) {
        authStore.setAccessToken(result.accessToken);
        authStore.setOrganizationId(result.organizationId);
      }
    } catch {
      throw redirect({
        to: "/$scopeId/dashboard",
        params: {
          scopeId: "personal",
        },
        search: {
          redirect: location.href
        }
      });
    }
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
