import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$orgSlug/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { orgSlug } = Route.useParams()
  return <div className='text-xl font-semibold'>Dashboard of { orgSlug }</div>
}
