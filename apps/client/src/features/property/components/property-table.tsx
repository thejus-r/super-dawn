import { usePropertyList } from "../hooks/use-property-list";

const PropertyTable = () => {
  const { data, isLoading } = usePropertyList();

  if (isLoading) {
    return <div> Loading ...</div>;
  }

  return (
    <div className="text-xs">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default PropertyTable;
