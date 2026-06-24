export type VisualSectionMode =
  | "fit-panel"
  | "overflow-panel"
  | "progress-panel"
  | "interactive-panel"
  | "free-section";

export type VisualSectionConfig = {
  slug: string;
  title: string;
  selector: string;
  mode: VisualSectionMode;
  states: Array<
    | "default"
    | "start"
    | "middle"
    | "end"
    | "progress-0"
    | "progress-50"
    | "progress-100"
  >;
  mustNotRevealNextPanel: boolean;
  criticalViewports: string[];
  notes?: string;
};

/*
 * Screenshot strategy by mode:
 * - fit-panel: one screenshot per viewport; bottom strip must not show another section
 * - overflow-panel: start / middle / end screenshots
 * - progress-panel: progress-0 / progress-50 / progress-100
 * - interactive-panel: UI states (tabs, open modals, etc.)
 * - free-section: viewport or fullPage screenshot
 */
export const visualSections: VisualSectionConfig[] = [
  {
    slug: "03-investments",
    title: "Investments",
    selector: "[data-investments-section]",
    mode: "fit-panel",
    states: ["default"],
    mustNotRevealNextPanel: true,
    criticalViewports: [
      "desktop-1440x900",
      "low-1440x760",
      "low-1503x700",
      "desktop-1920x1080",
      "low-1920x800",
      "qhd-2560x1440",
      "wqhd-2560x1080",
      "wqxga-2560x1600",
    ],
    notes:
      "fit-panel: bottom strip checked via elementFromPoint, not panel bounding rect.",
  },
];
