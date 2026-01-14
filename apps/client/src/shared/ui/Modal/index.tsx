import { Dialog } from "@base-ui/react"

interface ContentProps {
  title: string,
  description: string,
  children: React.ReactNode
}
export const Content: React.FC<ContentProps> = ({ title, description, children }) => {
  return <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Popup>
      <Dialog.Title>{ title }</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
      <div>
        {children}
      </div>
    </Dialog.Popup>

  </Dialog.Portal>

}


export const Modal = {
  Root: Dialog.Root,
  Content: Content,
  Trigger: Dialog.Trigger
}
