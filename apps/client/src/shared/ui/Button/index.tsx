import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import styles from "./index.module.css"

const buttonVariants = cva(
  styles.Base,
  {
    variants: {
      intent: {
        primary: styles.Primary,
        ghost: styles.Ghost,
        danger: styles.Danger
      },
      size: {
        regular: styles.Regular,
      },
      disabled: {
        false: styles.enabled,
        true: styles.disabled,
      },
    },
    defaultVariants: {
      intent: "primary",
      disabled: false,
      size: "regular",
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
