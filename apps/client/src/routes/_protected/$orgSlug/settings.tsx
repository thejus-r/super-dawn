import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$orgSlug/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Setting Page</div>
}
