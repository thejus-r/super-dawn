import { useAppForm } from "@/shared/components/Form/hooks/form";
import { CreateProperty, createPropertyFormSchema } from "../utils/schema";

type PropertyFormProps = {
  handleSubmit: (payload: CreateProperty) => void;
};

export const PropertyForm: React.FC<PropertyFormProps> = ({ handleSubmit }) => {
  const form = useAppForm({
    defaultValues: {
      name: "",
      ownerName: "",
      ownerContact: "",
      monthlyRent: "",
      securityDeposit: "",
    },
    validators: {
      onChange: createPropertyFormSchema,
    },
    onSubmit: ({ value }) => {
      handleSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField
        name="name"
        children={(field) => <field.TextField label="Property Name" />}
      />
      <form.AppField
        name="ownerName"
        children={(field) => <field.TextField label="Owner Name" />}
      />
      <form.AppField
        name="ownerContact"
        children={(field) => <field.TextField label="Owner Contact" />}
      />
      <form.AppField
        name="monthlyRent"
        children={(field) => <field.TextField label="Monthly Rent" />}
      />
      <form.AppField
        name="securityDeposit"
        children={(field) => <field.TextField label="Security Deposit" />}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitted]}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "..." : "Submit"}
          </button>
        )}
      />
    </form>
  );
};
