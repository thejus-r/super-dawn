import styles from "./Button.module.scss"

type ButtonProps = React.ComponentProps<"button"> & { }

export const Button: React.FC<ButtonProps> = (props) => {
  return <button className={styles.Button}  {...props} />
}
