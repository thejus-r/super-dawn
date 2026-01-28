import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { currentUserQueryOptions } from "@/features/auth/api/auth-query-options";
import { ScopeSwitcher } from "./scope-switcher";

const sideBarLink = [
  {
    label: "Dashboard",
    to: "/$scopeId"
  },
  {
    label: "Property",
    to: "/$scopeId/property"
  },
  {
    label: "Account",
    to: "/$scopeId/account"
  }
] as const

export const SideBar = ({ orgSlug }: { orgSlug: string}) => {
	return (
		<div className="p-3.5 w-56 border-r border-neutral-200 flex flex-col justify-between">
			<div>
				<h3 className="text-xl font-semibold">superdawn</h3>
			</div>

			<nav className="flex flex-col gap-2">
				{sideBarLink.map((link) => (
          <Link key={link.to} to={link.to} params={{ scopeId: orgSlug  }}>
						{link.label}
					</Link>
				))}
      </nav>
      <div className="flex flex-col gap-2">
			<ScopeSwitcher/>
      <div className="flex gap-2">
        <Suspense fallback={<ProfileCardSkeleton/>}>
          <ProfileCard/>
        </Suspense>
			</div>
      </div>
		</div>
	);
};

const ProfileCard = () => {

  const queryOptions = currentUserQueryOptions()

  const { data } = useSuspenseQuery(queryOptions)

  const initials = data.lastName ? `${data.firstName[0]}${data.lastName[0]}` : `${data.firstName[0]}${data.firstName[1]}`

  return <div className="flex gap-2 w-full bg-white border border-stone-200 p-2 rounded-xl">
    <div className="w-10 h-10 text-sm rounded-full bg-stone-100 flex items-center justify-center">{ initials }</div>
    <div className="flex flex-col gap-0.5 ">
      <span className="text-sm font-medium">{data.firstName} {data.lastName}</span>
      <span className="text-sm text-stone-400">{data.email}</span>
    </div>
  </div>
}

const ProfileCardSkeleton = () => {
  return <div className="w-full bg-white border border-stone-200 rounded-xl h-12">Loading</div>
}
