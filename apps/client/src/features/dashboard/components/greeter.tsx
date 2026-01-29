import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { currentUserQueryOptions } from "@/features/auth/api/auth-query-options"

export const Greeter = () => {
  return <Suspense fallback={<GreeterSkeleton/>}>
    <GreeterData/>
  </Suspense>

}

const GreeterData = () => {
  const { data } = useSuspenseQuery(currentUserQueryOptions())
  return <div className="mt-8 flex flex-col gap-1">
    <h6 className="text-sm text-stone-500">Welcome Back,</h6>
    <h2 className="text-2xl font-semibold font-serif">{data.firstName} {data.lastName}</h2>
  </div>
}

const GreeterSkeleton = () => {
  return <div>loading</div>
}
