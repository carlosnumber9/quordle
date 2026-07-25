import { LEGEND_CLASSES, type LegendProps } from "./definitions";

export function Legend({ children, variant }: LegendProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`flex size-9 items-center justify-center rounded-xl border font-semibold ${LEGEND_CLASSES[variant]}`}
      >
        A
      </span>
      <span className="text-sm">{children}</span>
    </div>
  );
}
