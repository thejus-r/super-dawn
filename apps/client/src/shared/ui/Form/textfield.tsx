import style from "./textfield.module.scss"

type TextFieldProps = React.ComponentProps<"input"> & {
  label: string
}

export const TextField: React.FC<TextFieldProps> = ({ label, ...props }) => {
  return <label className={style.TextField}>
    <span className={style.TextLabel}> {label}</span>
    <div className={style.InputContainer}>
      <input className={style.TextInput} {...props} />
    </div>
  </label>
}
