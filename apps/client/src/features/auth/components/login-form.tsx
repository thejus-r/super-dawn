import { useAppForm } from "@/shared/components/Form/hooks/form"
import { Button } from "@/shared/ui/Button"
import { useEmailLogin } from "../hooks/use-email-login"

export const LoginForm = () => {

  const { mutateAsync } = useEmailLogin()
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: ""
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    }
  })
  return <div className="w-full h-full flex items-center justify-center">
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="p-4 bg-white rounded-lg w-96"
    >
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="font-serif text-lg font-semibold">Welcome back</h2>
        <p className="text-sm text-stone-400">Enter your credentials to login back.</p>
      </div>
      <form.AppField
      name="email"
      children={
        (field) => <field.TextField
        label="Email Address" />
      } />
      <form.AppField
      name="password"
      children={
        (field) => <field.TextField
        type="password"
        label="Password"
        />
      } />
      <div className="flex justify-end">
        <Button>Continue</Button>
      </div>
    </form>

  </div>
}
