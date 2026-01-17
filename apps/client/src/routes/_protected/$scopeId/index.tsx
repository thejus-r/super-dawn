import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$scopeId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h3 className='text-xl font-medium'>Workspace</h3>
  </div>
}
