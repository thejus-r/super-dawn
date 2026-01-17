import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$scopeId/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/$scopeId/account"!</div>
}
