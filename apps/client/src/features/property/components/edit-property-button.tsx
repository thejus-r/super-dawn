import { Pencil } from "lucide-react";
import { useState } from "react";
import { IconButton } from "@/shared/ui/IconButton";
import { Modal } from "@/shared/ui/Modal";
import { useUpdateProperty } from "../hooks/use-update-property";
import type { CreateProperty } from "../utils/schema";
import type { Property } from "../utils/types";
import { PropertyForm } from "./property-form";

type Props = {
  property: Property;
};

export const EditPropertyButton: React.FC<Props> = ({ property }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useUpdateProperty();

  const handleSubmit = async (payload: CreateProperty) => {
    await mutateAsync({
      id: property.id,
      payload
    });
    setOpen(false);
  };
  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger
      render={
        <IconButton>
          <Pencil size={16} />
        </IconButton>
      }
      />
      <Modal.Content
        title="Edit property"
        description="Update property details."
      >
        <PropertyForm buttonLabel="Update Property" handleSubmit={handleSubmit} initialData={property} />
      </Modal.Content>
    </Modal.Root>
  );
};
