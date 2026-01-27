import { createFileRoute } from "@tanstack/react-router";
import { AddProperty } from "@/features/property/components/create-property";
import PropertyTable from "@/features/property/components/property-table";

export const Route = createFileRoute("/_protected/$scopeId/property")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <h3 className="text-xl font-medium">List of properties</h3>
      <AddProperty />
      <PropertyTable />
    </div>
  );
}
