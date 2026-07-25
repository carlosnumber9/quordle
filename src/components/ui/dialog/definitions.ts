import type * as React from "react"
import type { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

export type DialogContentProps = DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}

export type DialogFooterProps = React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}
