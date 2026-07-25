import { Button } from "@/components/ui/button";

import type { ActionKeyProps } from "./definitions";

export function ActionKey(props: ActionKeyProps) {
  return (
    <Button
      aria-label={props.ariaLabel}
      className={`h-[clamp(2.75rem,6svh,3rem)] rounded-lg px-1 ${props.className}`}
      disabled={props.disabled}
      onClick={props.onClick}
      type="button"
      variant="secondary"
    >
      {props.children}
    </Button>
  );
}
