import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog"
import styles from "./index.module.css"

type ContentProps = {
  title: string,
  description: string,
  children: React.ReactNode
}
const Content: React.FC<ContentProps> = ({ title, description, children }) => {
  return <BaseAlertDialog.Portal>
    <BaseAlertDialog.Backdrop className={styles.Backdrop} />
    <BaseAlertDialog.Popup className={styles.Popup}>
      <BaseAlertDialog.Title className={styles.Title}>{ title }</BaseAlertDialog.Title>
      <BaseAlertDialog.Description className={styles.Description}>{description}</BaseAlertDialog.Description>
      <div className={ styles.Actions }>
        { children }
      </div>
    </BaseAlertDialog.Popup>
  </BaseAlertDialog.Portal>
}


const AlertDialog = {
  Root: BaseAlertDialog.Root,
  Trigger: BaseAlertDialog.Trigger,
  Content: Content,
  Close: BaseAlertDialog.Close
}

export default AlertDialog
