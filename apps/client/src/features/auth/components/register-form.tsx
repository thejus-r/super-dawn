import { useAppForm } from "@/shared/components/Form/hooks/form"
import { Button } from "@/shared/ui/Button"
import { useEmailRegister } from "../hooks/use-email-register"
import { emailRegisterSchema } from "../utils/schema"

export const RegisterWithEmail = () => {

  const { mutateAsync } = useEmailRegister()
  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validators: {
      onChange: emailRegisterSchema
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    }

  })
  return <div className="grow bg-stone-100 flex flex-col items-center justify-center">
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="p-4 bg-white rounded-lg w-96">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-lg font-serif font-semibold">Create your account</h2>
        <p className="text-sm text-stone-400">Fill the details to create your account.</p>
      </div>
      <form.AppField
      name="firstName"
      children={
        (field) =>
        <field.TextField label="First Name" />
      }/>
      <form.AppField
      name="lastName"
      children={
        (field) =>
        <field.TextField label="Last Name" />
      } />
      <form.AppField
      name="email"
      children={
        (field) =>
        <field.TextField label="Email" />
      } />
      <form.AppField
      name="password"
      children={
        (field) =>
        <field.TextField type="password" label="Password" />
      } />
      <form.AppField
      name="confirmPassword"
      children={
        (field) =>
        <field.TextField type="password" label="Retype Password" />
      } />
      <div className="flex justify-end">
        <Button>Create account</Button>
      </div>
    </form>

  </div>
}
