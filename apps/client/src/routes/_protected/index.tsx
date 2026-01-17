import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
  beforeLoad: () => {
    throw redirect({
      to: "/$scopeId",
      params: {
        scopeId: "personal"
      }
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
