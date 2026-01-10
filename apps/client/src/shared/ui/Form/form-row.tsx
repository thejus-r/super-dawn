import style from "./form-row.module.scss"
export const FormRow: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {

  return <div className={style.FormColumn} {...props} />
}
