import { Dialog } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const modalContentVariant = cva([], {
  variants: {
    padding: {
      true: ["p-4"],
      false: ["p-0"],
    },
  },
  defaultVariants: {
    padding: true,
  },
});

interface ContentProps extends VariantProps<typeof modalContentVariant> {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({
  title,
  description,
  children,
  padding,
}) => {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/50 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
      <Dialog.Popup className="fixed drop-shadow-2xl overflow-clip rounded-2xl outline-4 outline-stone-900/10 top-[calc(50%+1.2rem*var(--nested-dialogs))] left-1/2 w-1/2 max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 scale-[calc(1-0.1*var(--nested-dialogs))] bg-stone-50 transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-nested-dialog-open:after:absolute data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:rounded-[inherit] data-data-nested-dialog-open:after:bg-stone-300 data-starting-style:scale-90 data-starting-style:opacity-0 dark:outline-gray-300">
        <div
          className={twMerge(
            modalContentVariant({ padding }),
            "border-b border-stone-200",
          )}
        >
          <Dialog.Title className="text-lg font-medium">{title}</Dialog.Title>
          <Dialog.Description className="text-sm text-neutral-400">
            {description}
          </Dialog.Description>
        </div>
        <div className="flex flex-col">{children}</div>
      </Dialog.Popup>
    </Dialog.Portal>
  );
};

export const Modal = {
  Root: Dialog.Root,
  Content: Content,
  Trigger: Dialog.Trigger,
  Close: Dialog.Close,
};
