import { useStore } from "@tanstack/react-form";
import { cva, type VariantProps } from "class-variance-authority";
import { useFieldContext } from "../hooks/form-context";

const inputVariants = cva(
  ["border", "rounded-lg", "h-9", "px-2", "bg-stone-100", "w-full"],
  {
    variants: {
      intent: {
        default: [
          "border-stone-200",
          "focus:ring-neutral-900",
          "focus:outline-2",
          "focus:outline-stone-900",
        ],
        error: ["border-red-500", "focus:ring-red-200", "focus:border-red-500"],
      },
    },

    defaultVariants: {
      intent: "default",
    },
  },
);

const labelVariants = cva(["block", "text-xs", "transition-colors"], {
  variants: {
    intent: {
      default: ["text-stone-500"],
      error: ["text-red-500"],
    },
  },

  defaultVariants: {
    intent: "default",
  },
});

type TextFieldProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    label: string;
  };

export const TextField: React.FC<TextFieldProps> = ({
  label,
  intent,
  ...props
}) => {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  const hasError = errors.length > 0;
  const currentIntent = hasError ? "error" : intent;

  return (
    <div className="h-20">
      <label className="flex flex-col gap-1 mb-1">
        <span className={labelVariants({ intent: currentIntent })}>
          {label}
        </span>
        <input
          className={inputVariants({ intent: currentIntent })}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          {...props}
        />
      </label>
      <div>
        {errors.map((error) => (
          <div key={error} className="text-xs text-red-500">{error.message}</div>
        ))}
      </div>
    </div>
  );
};
