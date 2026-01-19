import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  ["focus:outline-none", "tracking-wide", "transition-all"],
  {
    variants: {
      intent: {
        primary: [
          "bg-black",
          "text-white",
          "hover:bg-stone-800",
          "hover:outline-3",
          "outline-stone-300",
          "focus:ring-2",
          "ring-offset-1",
          "ring-stone-400",
        ],
        ghost: ["bg-none", "text-stone-900", "hover:bg-stone-200"],
      },
      size: {
        medium: ["rounded-lg", "text-sm", "px-2.5", "py-1.5", "min-w-20"],
      },
      disabled: {
        false: null,
        true: ["opacity-50", "cursor-not-allowed"],
      },
    },
    defaultVariants: {
      intent: "primary",
      disabled: false,
      size: "medium",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {};

export const Button: React.FC<ButtonProps> = ({
  intent,
  className,
  ...props
}) => {
  return (
    <button
      className={twMerge(buttonVariants({ intent }), className)}
      {...props}
    />
  );
};
