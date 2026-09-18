import type { BadgeOptions } from "./types";

export interface BadgeTemplate {
  id: string;
  name: string;
  description: string;
  options: Pick<
    BadgeOptions,
    | "style"
    | "template"
    | "labelColor"
    | "messageColor"
    | "textColor"
    | "radius"
    | "height"
    | "fontSize"
  >;
}

export const badgeTemplates: BadgeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean and balanced",
    options: {
      style: "flat",
      template: "classic",
      labelColor: "#475569",
      messageColor: "#2563eb",
      textColor: "#ffffff",
      radius: 4,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "github",
    name: "GitHub",
    description: "Developer focused",
    options: {
      style: "flat-square",
      template: "github",
      labelColor: "#24292f",
      messageColor: "#0969da",
      textColor: "#ffffff",
      radius: 3,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "npm",
    name: "npm",
    description: "Package badge",
    options: {
      style: "pill",
      template: "npm",
      labelColor: "#cb3837",
      messageColor: "#2d333b",
      textColor: "#ffffff",
      radius: 10,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "modrinth",
    name: "Modrinth",
    description: "Modern project badge",
    options: {
      style: "soft",
      template: "modrinth",
      labelColor: "#1f2937",
      messageColor: "#1bd96a",
      textColor: "#ffffff",
      radius: 6,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "discord",
    name: "Discord",
    description: "Community badge",
    options: {
      style: "pill",
      template: "discord",
      labelColor: "#5865f2",
      messageColor: "#404eed",
      textColor: "#ffffff",
      radius: 12,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "build",
    name: "Build",
    description: "Build and CI status",
    options: {
      style: "dot",
      template: "build",
      labelColor: "#1e293b",
      messageColor: "#22c55e",
      textColor: "#ffffff",
      radius: 5,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "downloads",
    name: "Downloads",
    description: "Download statistics",
    options: {
      style: "flat",
      template: "downloads",
      labelColor: "#0f172a",
      messageColor: "#2563eb",
      textColor: "#ffffff",
      radius: 6,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "version",
    name: "Version",
    description: "Project version",
    options: {
      style: "flat",
      template: "version",
      labelColor: "#334155",
      messageColor: "#6366f1",
      textColor: "#ffffff",
      radius: 6,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "license",
    name: "License",
    description: "License information",
    options: {
      style: "flat",
      template: "license",
      labelColor: "#334155",
      messageColor: "#16a34a",
      textColor: "#ffffff",
      radius: 6,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "coverage",
    name: "Coverage",
    description: "Code coverage status",
    options: {
      style: "soft",
      template: "coverage",
      labelColor: "#334155",
      messageColor: "#16a34a",
      textColor: "#ffffff",
      radius: 5,
      height: 24,
      fontSize: 11,
    },
  },
  {
    id: "release",
    name: "Release",
    description: "Release information",
    options: {
      style: "flat",
      template: "release",
      labelColor: "#334155",
      messageColor: "#7c3aed",
      textColor: "#ffffff",
      radius: 6,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "opensource",
    name: "Open Source",
    description: "Open source project",
    options: {
      style: "mono",
      template: "opensource",
      labelColor: "#171717",
      messageColor: "#22c55e",
      textColor: "#ffffff",
      radius: 5,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "documentation",
    name: "Documentation",
    description: "Documentation status",
    options: {
      style: "flat",
      template: "documentation",
      labelColor: "#1e293b",
      messageColor: "#0ea5e9",
      textColor: "#ffffff",
      radius: 5,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "website",
    name: "Website",
    description: "Website link",
    options: {
      style: "flat",
      template: "website",
      labelColor: "#1e293b",
      messageColor: "#2563eb",
      textColor: "#ffffff",
      radius: 5,
      height: 22,
      fontSize: 11,
    },
  },
  {
    id: "security",
    name: "Security",
    description: "Security status",
    options: {
      style: "flat",
      template: "security",
      labelColor: "#1e293b",
      messageColor: "#22c55e",
      textColor: "#ffffff",
      radius: 5,
      height: 22,
      fontSize: 11,
    },
  },
];