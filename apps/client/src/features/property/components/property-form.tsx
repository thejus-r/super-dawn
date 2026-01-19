import { useAppForm } from "@/shared/components/Form/hooks/form";
import { CreateProperty, createPropertyFormSchema } from "../utils/schema";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";

type PropertyFormProps = {
  handleSubmit: (payload: CreateProperty) => void;
};

export const PropertyForm: React.FC<PropertyFormProps> = ({ handleSubmit }) => {
  const form = useAppForm({
    defaultValues: {
      name: "",
      ownerName: "",
      ownerContact: "",
      monthlyRent: "0",
      securityDeposit: "0",
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
      <div className="flex gap-2 justify-end">
        <Modal.Close
          render={
            <Button intent="ghost" type="submit">
              Cancel
            </Button>
          }
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitted]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </div>
    </form>
  );
};
