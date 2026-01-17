import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../hooks/form-context";

export interface TextFieldProps extends React.ComponentProps<"input"> {
  label: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, ...props }) => {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <label className="flex flex-col gap-1 mb-2">
        <span className="block text-xs font-medium text-neutral-400">
          {label}
        </span>
        <input
          className="border px-1.5 border-neutral-200 h-8 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          {...props}
        />
      </label>
      <div>
        {errors.map((error) => (
          <div className="text-xs text-red-500">{error.message}</div>
        ))}
      </div>
    </div>
  );
};
