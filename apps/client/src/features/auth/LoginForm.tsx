import { Button } from "@/shared/ui/Button";
import { FormRow } from "@/shared/ui/Form/form-row";
import { TextField } from "@/shared/ui/Form/textfield";
import { useLogin } from "./hooks/use-login";

export const LoginForm = () => {
  const { data, mutate } = useLogin();

  const handleSubmit = () => {
    mutate();
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        style={{
          padding: "20px",
        }}
      >
        <FormRow>
          <TextField label="Email" />
          <TextField type="password" label="Password" />
          <Button>Login</Button>
        </FormRow>
      </form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
