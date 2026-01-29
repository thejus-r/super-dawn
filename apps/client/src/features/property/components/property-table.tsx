import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { usePropertyList } from "../hooks/use-property-list";
import type { Property } from "../utils/types";
import { DeletePropertyButton } from "./delete-property-button";
import { EditPropertyButton } from "./edit-property-button";

const columnHelper = createColumnHelper<Property>();

const columns = [
	columnHelper.accessor("name", {
		header: () => <span>Name</span>,
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("ownerName", {
		header: () => <span>Owner Name</span>,
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("ownerContact", {
		header: () => <span>Owner Contact</span>,
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("monthlyRent", {
		header: () => <span>Monthly Rent</span>,
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("securityDeposit", {
		header: () => <span>Security Deposit</span>,
		cell: (info) => info.getValue(),
	}),
	columnHelper.display({
		id: "actions",
		header: () => <span>Actions</span>,
		cell: (props) => (
			<div className="flex space-x-2">
				<EditPropertyButton property={props.row.original} />
				<DeletePropertyButton property={props.row.original}/>
			</div>
		),
	}),
];

const PropertyTable = () => {
  const { data, isLoading } = usePropertyList();
	const table = useReactTable({
		data: data?.properties ?? [],
    columns,
    manualPagination: true,
		getCoreRowModel: getCoreRowModel(),
	});

	if (isLoading) {
		return <div> Loading ...</div>;
	}

	return (
		<div className="px-4 border border-neutral-200 rounded-xl bg-white">
			<table className="table-auto w-full border-collapse">
				<thead className="border-b border-neutral-200">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									className={`text-left text-neutral-500 text-sm font-medium pt-2.5 pb-2.5 ${header.column.id === "actions" ? "w-px whitespace-nowrap" : ""}`}
									key={header.id}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr className="not-last:border-b border-neutral-200" key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td className="py-2.5 text-sm" key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default PropertyTable;
