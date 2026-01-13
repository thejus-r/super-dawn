type TextFieldProps = React.ComponentProps<"input"> & {
  label: string
}

export const TextField: React.FC<TextFieldProps> = ({ label, ...props }) => {
  return <label>
    <span > {label}</span>
    <div>
      <input{...props} />
    </div>
  </label>
}
