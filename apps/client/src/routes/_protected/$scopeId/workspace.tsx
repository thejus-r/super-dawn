import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$scopeId/workspace')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='w-full h-full'>
    <h3 className='font-serif text-xl font-medium'>Workspace</h3>
    <div className='flex w-full h-full font-mono text-xs items-center justify-center'>Work in progress</div>
  </div>
}
