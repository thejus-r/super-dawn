import { createFileRoute } from '@tanstack/react-router'
import { RegisterWithEmail } from '@/features/auth/components/register-form'

export const Route = createFileRoute('/_public/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <div className="h-full w-full flex flex-col">
    <RegisterWithEmail/>
  </div>
}
