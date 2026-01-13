import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/shared/components/AppShell'
import { SideBar } from '@/shared/components/SideBar'

export const Route = createFileRoute('/_protected/$orgSlug')({
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
