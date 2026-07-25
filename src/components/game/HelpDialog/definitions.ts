export type LegendVariant = "correct" | "present" | "absent";

export interface LegendProps {
  readonly children: string;
  readonly variant: LegendVariant;
}

export const LEGEND_CLASSES: Readonly<Record<LegendVariant, string>> = {
  correct: "border-primary bg-primary text-primary-foreground",
  present: "border-transparent bg-sky-300 text-sky-950",
  absent: "border-muted bg-muted text-muted-foreground",
};
