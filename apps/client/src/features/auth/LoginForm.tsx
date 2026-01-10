import { Button } from "@/shared/ui/Button"
import { FormRow } from "@/shared/ui/Form/form-row"
import { TextField } from "@/shared/ui/Form/TextField"

export const LoginForm = () => {
  return <div>
    <form style={{
      padding: "20px"
    }}>
      <FormRow>
        <TextField label="Email"/>
        <TextField type="password" label="Password" />
        <Button>Login</Button>
      </FormRow>
    </form>
  </div>
}
