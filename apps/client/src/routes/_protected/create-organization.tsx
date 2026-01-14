import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/create-organization')({
  component: RouteComponent,
})



function RouteComponent() {
  return <div>
    create org
  </div>
}
