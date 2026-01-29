import { createFileRoute } from '@tanstack/react-router'
import { Greeter } from '@/features/dashboard/components/greeter'

export const Route = createFileRoute('/_protected/$scopeId/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h3 className='font-serif text-xl font-medium'>Workspace</h3>
    <Greeter/>
  </div>
}
