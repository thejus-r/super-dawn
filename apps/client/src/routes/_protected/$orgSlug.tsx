import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppShell } from '@/shared/components/AppShell'
import { SideBar } from '@/shared/components/SideBar'

export const Route = createFileRoute('/_protected/$orgSlug')({
  beforeLoad: ({ params }) => {
    if (!params) {
      throw redirect({
        to: "/"
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {

  const { orgSlug } = Route.useParams()

  return <>
    <SideBar orgSlug={orgSlug} />
    <AppShell>
      <Outlet/>
    </AppShell>
  </>
}
