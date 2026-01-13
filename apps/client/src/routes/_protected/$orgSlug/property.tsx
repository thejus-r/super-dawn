import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$orgSlug/property')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Property Page</div>
}
