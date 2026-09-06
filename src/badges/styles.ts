import type { BadgeStyle } from "./types";

export const badgeStyles: {
  id: BadgeStyle;
  name: string;
  description: string;
}[] = [
  ["flat", "Flat", "Classic badge"],
  ["flat-square", "Flat Square", "Sharp corners"],
  ["pill", "Pill", "Rounded capsule"],
  ["plastic", "Plastic", "Glossy surface"],
  ["for-the-badge", "For The Badge", "Large uppercase"],
  ["social", "Social", "Social-style badge"],
  ["minimal", "Minimal", "Text only"],
  ["outline", "Outline", "Border style"],
  ["soft", "Soft", "Soft surfaces"],
  ["gradient", "Gradient", "Gradient surface"],
  ["compact", "Compact", "Small badge"],
  ["dot", "Dot", "Status dot"],
  ["glass", "Glass", "Glass surface"],
  ["neon", "Neon", "Bright accent"],
  ["mono", "Mono", "Single color"],
  ["elevated", "Elevated", "Raised surface"],
  ["inset", "Inset", "Inset surface"],
  ["transparent", "Transparent", "Transparent background"]
].map(([id, name, description]) => ({
    id: id as BadgeStyle,
    name,
    description
  }));
