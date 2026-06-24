export type ViewportPreset = {
  name: string;
  width: number;
  height: number;
  group:
    | "mobile"
    | "tablet"
    | "desktop"
    | "lowHeightDesktop"
    | "twoK";
  note?: string;
};

export const viewportPresets: ViewportPreset[] = [
  { name: "mobile-375x812", width: 375, height: 812, group: "mobile" },

  { name: "tablet-768x1024", width: 768, height: 1024, group: "tablet" },
  { name: "tablet-1024x768", width: 1024, height: 768, group: "tablet" },

  { name: "desktop-1366x768", width: 1366, height: 768, group: "desktop" },
  { name: "desktop-1440x900", width: 1440, height: 900, group: "desktop" },
  { name: "desktop-1920x1080", width: 1920, height: 1080, group: "desktop" },

  { name: "low-1440x760", width: 1440, height: 760, group: "lowHeightDesktop", note: "Critical for pinned slides" },
  { name: "low-1503x700", width: 1503, height: 700, group: "lowHeightDesktop", note: "Critical wide/low viewport" },
  { name: "low-1920x800", width: 1920, height: 800, group: "lowHeightDesktop", note: "Critical for next-panel reveal" },

  { name: "2k-2048x1080", width: 2048, height: 1080, group: "twoK", note: "DCI-like 2K / wide desktop" },
  { name: "2k-2048x1152", width: 2048, height: 1152, group: "twoK", note: "2K 16:9-ish" },
  { name: "qhd-2560x1440", width: 2560, height: 1440, group: "twoK", note: "Common QHD monitor" },
  { name: "wqhd-2560x1080", width: 2560, height: 1080, group: "twoK", note: "Ultrawide low-height risk" },
  { name: "wqxga-2560x1600", width: 2560, height: 1600, group: "twoK", note: "16:10 high desktop" },
  { name: "uwqhd-3440x1440", width: 3440, height: 1440, group: "twoK", note: "Ultrawide QHD" }
];
