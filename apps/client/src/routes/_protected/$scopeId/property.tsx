import { createFileRoute } from "@tanstack/react-router";
import PropertyTable from "@/features/property/components/property-table";
import { AddProperty } from "@/features/property/components/create-property";

export const Route = createFileRoute("/_protected/$scopeId/property")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h3 className="text-xl font-medium">List of properties</h3>
      <AddProperty />
      <PropertyTable />
    </div>
  );
}
