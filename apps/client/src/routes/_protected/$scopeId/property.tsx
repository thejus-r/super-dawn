import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { AddProperty } from "@/features/property/components/create-property";
import PropertyTable from "@/features/property/components/property-table";
import { usePropertyFilters } from "@/features/property/hooks/use-property-filter";
import { PropertySearchSchema } from "@/features/property/utils/schema";
import { useDebounce } from "@/shared/hooks/use-debounce";

export const Route = createFileRoute("/_protected/$scopeId/property")({
  validateSearch: (search) => PropertySearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h3 className="font-serif text-xl font-semibold">Properties</h3>
        <AddProperty />
      </div>
      <div className="flex flex-col gap-4">
        <PropertyFilters />
        <SearchInput/>
        <PropertyTable />
      </div>
    </div>
  );
}

function PropertyFilters() {
  const { filters } = usePropertyFilters()

  return <pre className="text-xs">
    {JSON.stringify(filters, null, 2)}
  </pre>
}

function SearchInput() {
  const { setFilters } = usePropertyFilters()
  const [localValue, setLocalValue] = useState("")

  const searchValue = useDebounce(localValue)

  setFilters((prev) => ({
    ...prev,
    search: searchValue
  }))

  return <div className="bg-white h-9 px-2 group has-focus-within:outline-2 has-focus-within:outline-stone-800 flex gap-1 outline outline-stone-200 rounded-xl items-center">
    <span><SearchIcon className="text-stone-300 group-has-focus:text-stone-800" size={20}/></span>
    <input onChange={(e) => setLocalValue(e.target.value)} className="w-full h-full focus:outline-none placeholder:text-stone-300" placeholder="Search" />
    <span><XIcon className="text-stone-300 group-has-focus:text-stone-800" size={20}/></span>
  </div>
}
