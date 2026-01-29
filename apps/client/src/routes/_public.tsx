import { createFileRoute, isRedirect, Outlet, redirect } from '@tanstack/react-router'
import { z } from "zod"
import { currentUserQueryOptions } from '@/features/auth/api/auth-query-options'

export const Route = createFileRoute('/_public')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ context, search }) => {
    // // check if the user is already logged in.
    const { queryClient } = context
    try {
      const user = await queryClient.ensureQueryData(currentUserQueryOptions())

      if (search.redirect) {
        throw redirect({
          to: search.redirect,
        });
      }

      const defaultScope = user.memberships?.[0]?.organization?.slug || "personal";
      throw redirect({
        to: "/$scopeId/dashboard",
        params: { scopeId: defaultScope },
      });
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
      return
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='h-full bg-stone-100'>
    <Outlet />
  </div>
}
