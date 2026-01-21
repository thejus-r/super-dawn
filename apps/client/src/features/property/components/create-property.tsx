import { useCreateProperty } from "../hooks/use-create-property";
import { Modal } from "@/shared/ui/Modal";
import { CreateProperty } from "../utils/schema";
// import { PropertyForm } from "./property-form";
import { PropertyForm } from "./property-form";
import { Button } from "@/shared/ui/Button";

export const AddProperty: React.FC = () => {
  const { mutate } = useCreateProperty();

  const handleFormSubmit = (payload: CreateProperty) => {
    mutate(payload);
  };

  return (
    <Modal.Root disablePointerDismissal>
      <Modal.Trigger render={<Button>Add Property</Button>} />
      <Modal.Content
        title="Add new property"
        description="Fill the details to add new property"
      >
        <PropertyForm />
      </Modal.Content>
    </Modal.Root>
  );
};
