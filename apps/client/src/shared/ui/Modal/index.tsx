import { Dialog } from "@base-ui/react";

interface ContentProps {
  title: string;
  description: string;
  children: React.ReactNode;
}
export const Content: React.FC<ContentProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/50 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
      <Dialog.Popup className="fixed top-[calc(50%+1.25rem*var(--nested-dialogs))] left-1/2 flex flex-col gap-4 -mt-8 w-1/2 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 scale-[calc(1-0.1*var(--nested-dialogs))] bg-gray-50 p-5 text-gray-900 outline-1 outline-gray-200 transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-nested-dialog-open:after:absolute data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:rounded-[inherit] data-data-nested-dialog-open:after:bg-black/5 data-starting-style:scale-90 data-starting-style:opacity-0 dark:outline-gray-300">
        <div className="flex flex-col gap-0.5">
          <Dialog.Title className="text-lg font-medium">{title}</Dialog.Title>
          <Dialog.Description className="text-sm text-neutral-400">
            {description}
          </Dialog.Description>
        </div>
        <div>{children}</div>
      </Dialog.Popup>
    </Dialog.Portal>
  );
};

export const Modal = {
  Root: Dialog.Root,
  Content: Content,
  Trigger: Dialog.Trigger,
};
