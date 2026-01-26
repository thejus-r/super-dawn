import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { useCreateProperty } from "../hooks/use-create-property";
import type { CreateProperty } from "../utils/schema";
// import { PropertyForm } from "./property-form";
import { PropertyForm } from "./property-form";

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
				<PropertyForm
					buttonLabel="Create Property"
					handleSubmit={handleFormSubmit}
				/>
			</Modal.Content>
		</Modal.Root>
	);
};
