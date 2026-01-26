import { cva, type VariantProps } from "class-variance-authority"
import styles from  "./style.module.css"

const iconButtonVariants = cva(styles.base, {
  variants: {
    intent: {
      primary: styles.primary,
      danger: styles.danger
    },
    size: {
      regular: styles.regular
    },
    disabled: {
      false: styles.enabled,
      true: styles.disable,
    }
  },
  defaultVariants: {
    intent: "primary",
    size: "regular",
    disabled: false
  }
})

type IconButtonProps = React.ComponentProps<"button">
& VariantProps<typeof iconButtonVariants>

export const IconButton: React.FC<IconButtonProps> = ({ intent, size ,...props }) => {
  return <button className={iconButtonVariants({ intent, size })} {...props}></button>
}
