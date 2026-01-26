import { Trash } from "lucide-react";
import { useState } from "react";
import AlertDialog from "@/shared/ui/AlertDialog";
import { Button } from "@/shared/ui/Button";
import { IconButton } from "@/shared/ui/IconButton";
import { useDeleteProperty } from "../hooks/use-delete-property";
import type { Property } from "../utils/types";

type Props = {
	property: Property;
};
export const DeletePropertyButton: React.FC<Props> = ({ property }) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync } = useDeleteProperty();

  const handleDelete = async () => {
    await mutateAsync(property.id)
    setOpen(false)
  }

	return (
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Trigger
				render={
					<IconButton intent="danger">
						<Trash size={16} />
					</IconButton>
				}
			/>
			<AlertDialog.Content
				title="Delete property"
				description=" You can't undo this action. "
			>
				<AlertDialog.Close render={<Button intent="ghost">Cancel</Button>} />

				<Button onClick={handleDelete} intent="danger">Delete</Button>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};
