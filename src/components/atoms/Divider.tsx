import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Thickness preset (maps to border-width); pass a CSS value for a custom thickness instead. */
  thickness?: "xs" | "sm" | "md" | "lg" | "xl" | string;
  label?: React.ReactNode;
}

const presetThickness: Record<string, string> = { xs: "1px", sm: "1px", md: "1.5px", lg: "2px", xl: "3px" };

export function Divider({ orientation = "horizontal", thickness = "sm", label, className, ...props }: DividerProps) {
  const px = presetThickness[thickness] ?? thickness;

  if (orientation === "vertical") {
    return <div role="separator" aria-orientation="vertical" className={cn("self-stretch bg-border", className)} style={{ width: px }} {...props} />;
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3 text-xs text-text-muted", className)} {...props}>
        <span className="flex-1 bg-border" style={{ height: px }} />
        <span>{label}</span>
        <span className="flex-1 bg-border" style={{ height: px }} />
      </div>
    );
  }

  return <div role="separator" aria-orientation="horizontal" className={cn("w-full bg-border", className)} style={{ height: px }} {...props} />;
}
