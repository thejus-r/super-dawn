import { Link } from "@tanstack/react-router";

const sideBarLink = [
  {
    label: "Dashboard",
    to: "/$orgSlug"
  },
  {
    label: "Property",
    to: "/$orgSlug/property"
  },
  {
    label: "Settings",
    to: "/$orgSlug/settings"
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
          <Link key={link.to} to={link.to} params={{ orgSlug: orgSlug  }}>
						{link.label}
					</Link>
				))}
			</nav>
			<div className="flex gap-2">
				<div className="w-10 h-10 bg-neutral-100 border border-neutral-200"></div>
				<div>
					<h6 className="text-sm">Thejus Rajendran</h6>
					<p className="text-xs font-medium text-neutral-400">
						thejus@mail.com
					</p>
				</div>
			</div>
		</div>
	);
};
