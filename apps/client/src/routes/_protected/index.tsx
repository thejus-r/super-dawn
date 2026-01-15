import { createFileRoute, Link } from '@tanstack/react-router'

const listOfOrganization = [
  {
    orgId: "1",
    orgSlug: "vadakaveedu",
    orgName: "Vadakaveedu"

  },
  {
    orgId: "2",
    orgSlug: "raven",
    orgName: "Raven Homes"
  },
]

export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='flex w-full justify-center flex-col items-center bg-neutral-100'>
    <div className='flex flex-col gap-2 bg-white border border-neutral-300 p-4 w-1/4'>
      <div className='flex flex-col gap-1'>
        <h3 className='text-xl font-medium'>Select organization</h3>
        <p className='text-sm text-neutral-400'>Select an organization to continue.</p>
      </div>
      <div>
        {listOfOrganization.map(org => {
          return <Link className='hover:bg-neutral-100' to="/$orgSlug" key={org.orgId} params={{ orgSlug: org.orgSlug }}>
          <div className='flex gap-2.5 py-2' key={org.orgId}>
            <div className='bg-neutral-100 w-12 h-12'>
            </div>
            <div>
              <h3>
                {org.orgName}
              </h3>
              <p className=' text-sm text-neutral-400'>{ org.orgSlug}</p>
            </div>
          </div>
          </Link>
        })}
      </div>
      <Link to="/create-organization"> Create organization </Link>
    </div>
  </div>
}
