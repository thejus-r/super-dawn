import {
	createFileRoute,
	Outlet,
	redirect,
	useParams,
} from "@tanstack/react-router";
import { validateScope } from "@/features/auth/api/auth-query-fns";
import { currentUserQueryOptions } from "@/features/auth/api/auth-query-options";
import { AppShell } from "@/shared/components/AppShell";
import { SideBar } from "@/shared/components/SideBar";

export const Route = createFileRoute("/_protected/$scopeId")({
	beforeLoad: async ({ params, context }) => {
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

			const result = await validateScope(scope);
			authStore.setAccessToken(result.accessToken);
			authStore.setOrganizationId(result.organizationId);
		} catch {
			throw redirect({
				to: "/$scopeId",
				params: {
					scopeId: "personal",
				},
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
