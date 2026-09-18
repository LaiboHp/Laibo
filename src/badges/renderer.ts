import type { BadgeOptions } from "./types";
import { getProviderIcon } from "./icons";

// ═══════════════════════════════════════
// Main renderer
// ═══════════════════════════════════════

export function renderBadge(options: BadgeOptions): string {
  if (options.template) {
    return renderTemplate(options);
  }

  const rawLabel = String(options.label ?? "");
  const rawMessage = String(options.message ?? "");

  const label = escapeXml(rawLabel);
  const message = escapeXml(rawMessage);

  const style = options.style;

  const height = clamp(options.height, 16, 48);

  const fontSize =
    style === "for-the-badge"
      ? Math.max(10, clamp(options.fontSize, 8, 18) + 1)
      : clamp(options.fontSize, 8, 18);

  const radius =
    style === "pill"
      ? height / 2
      : style === "flat-square"
        ? 0
        : clamp(options.radius, 0, Math.min(20, height / 2));

  const colors: Colors = {
    label: safeColor(options.labelColor, "#475569"),
    message: safeColor(options.messageColor, "#2563eb"),
    text: safeColor(options.textColor, "#ffffff"),
  };

  const padding = getPadding(style);

  const labelWidth = measureText(rawLabel, fontSize, padding, style);
  const messageWidth = measureText(rawMessage, fontSize, padding, style);

  const width = labelWidth + messageWidth;
  const textY = height / 2;

  switch (style) {
    case "minimal":
      return renderMinimal(width, height, textY, fontSize, label, message, colors);

    case "transparent":
      return renderTransparent(width, height, textY, fontSize, label, message, colors);

    case "dot":
      return renderDot(width, height, textY, fontSize, label, message, colors);

    case "outline":
      return renderOutline(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "soft":
      return renderSoft(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "gradient":
      return renderGradient(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "compact":
      return renderFlat(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "glass":
      return renderGlass(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "neon":
      return renderNeon(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "mono":
      return renderMono(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "elevated":
      return renderElevated(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "inset":
      return renderInset(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "plastic":
      return renderPlastic(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "social":
      return renderSocial(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "for-the-badge":
      return renderForTheBadge(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "pill":
      return renderFlat(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);

    case "flat-square":
      return renderFlat(width, height, textY, fontSize, 0, labelWidth, messageWidth, label, message, colors);

    case "flat":
    default:
      return renderFlat(width, height, textY, fontSize, radius, labelWidth, messageWidth, label, message, colors);
  }
}

// ═══════════════════════════════════════
// Templates
// ═══════════════════════════════════════

function renderTemplate(options: BadgeOptions): string {
  switch (options.template) {
    case "github":
      return renderTemplateGithub(options);
    case "npm":
      return renderTemplateNpm(options);
    case "modrinth":
      return renderTemplateModrinth(options);
    case "discord":
      return renderTemplateDiscord(options);
    case "build":
      return renderTemplateBuild(options);
    case "downloads":
      return renderTemplateDownloads(options);
    case "version":
      return renderTemplateVersion(options);
    case "license":
      return renderTemplateLicense(options);
    case "coverage":
      return renderTemplateCoverage(options);
    case "release":
      return renderTemplateRelease(options);
    case "opensource":
      return renderTemplateOpenSource(options);
    case "documentation":
      return renderTemplateDocumentation(options);
    case "website":
      return renderTemplateWebsite(options);
    case "security":
      return renderTemplateSecurity(options);
    case "classic":
    default:
      return renderTemplateClassic(options);
  }
}

// ═══════════════════════════════════════
// Classic
// ═══════════════════════════════════════

function renderTemplateClassic(options: BadgeOptions): string {
  return renderIconSplitTemplate(options, "", {
    labelColor: options.labelColor,
    messageColor: options.messageColor,
    radius: options.radius,
    labelWeight: 400,
    messageWeight: 600,
  });
}

// ═══════════════════════════════════════
// GitHub
// ═══════════════════════════════════════

function renderTemplateGithub(options: BadgeOptions): string {
  return renderIconSplitTemplate(
    options,
    getProviderIcon("github", 14),
    {
      labelColor: "#24292f",
      messageColor: "#0969da",
      radius: 4,
      labelWeight: 600,
      messageWeight: 600,
    },
  );
}

// ═══════════════════════════════════════
// npm
// ═══════════════════════════════════════

function renderTemplateNpm(options: BadgeOptions): string {
  const height = clamp(options.height, 18, 48);

  return renderIconSplitTemplate(
    options,
    getProviderIcon("npm", 14),
    {
      labelColor: "#cb3837",
      messageColor: "#2d333b",
      radius: Math.min(height / 2, 20),
      labelWeight: 700,
      messageWeight: 600,
    },
  );
}

// ═══════════════════════════════════════
// Modrinth
// ═══════════════════════════════════════

function renderTemplateModrinth(options: BadgeOptions): string {
  const height = clamp(options.height, 18, 48);
  return renderIconSplitTemplate(options, modrinthIcon(height), {
    labelColor: "#1f2937",
    messageColor: "#1bd96a",
    radius: 6,
    labelWeight: 600,
    messageWeight: 700,
  });
}

// ═══════════════════════════════════════
// Discord
// ═══════════════════════════════════════

function renderTemplateDiscord(options: BadgeOptions): string {
  const height = clamp(options.height, 18, 48);
  return renderIconSplitTemplate(options, discordIcon(height), {
    labelColor: "#5865f2",
    messageColor: "#404eed",
    radius: Math.min(height / 2, 20),
    labelWeight: 600,
    messageWeight: 600,
  });
}

// ═══════════════════════════════════════
// Build
// ═══════════════════════════════════════

function renderTemplateBuild(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconStatusTemplate(options, checkIcon(height), "BUILD");
}

// ═══════════════════════════════════════
// Downloads
// ═══════════════════════════════════════

function renderTemplateDownloads(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconMetricTemplate(options, downloadIcon(height), "DOWNLOADS");
}

// ═══════════════════════════════════════
// Version
// ═══════════════════════════════════════

function renderTemplateVersion(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconMetricTemplate(options, versionIcon(height), "VERSION");
}

// ═══════════════════════════════════════
// License
// ═══════════════════════════════════════

function renderTemplateLicense(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconMetricTemplate(options, licenseIcon(height), "LICENSE");
}

// ═══════════════════════════════════════
// Release
// ═══════════════════════════════════════

function renderTemplateRelease(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconMetricTemplate(options, releaseIcon(height), "RELEASE");
}

// ═══════════════════════════════════════
// Open Source
// ═══════════════════════════════════════

function renderTemplateOpenSource(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconStatusTemplate(options, openSourceIcon(height), "OPEN SOURCE");
}

// ═══════════════════════════════════════
// Documentation
// ═══════════════════════════════════════

function renderTemplateDocumentation(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconStatusTemplate(options, documentationIcon(height), "DOCS");
}

// ═══════════════════════════════════════
// Website
// ═══════════════════════════════════════

function renderTemplateWebsite(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconStatusTemplate(options, websiteIcon(height), "WEBSITE");
}

// ═══════════════════════════════════════
// Security
// ═══════════════════════════════════════

function renderTemplateSecurity(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  return renderIconStatusTemplate(options, securityIcon(height), "SECURITY");
}

// ═══════════════════════════════════════
// Coverage
// ═══════════════════════════════════════

function renderTemplateCoverage(options: BadgeOptions): string {
  const height = clamp(options.height, 20, 48);
  const fontSize = clamp(options.fontSize, 8, 18);

  const rawLabel = String(options.label ?? "");
  const rawMessage = String(options.message ?? "");

  const label = escapeXml(rawLabel);
  const message = escapeXml(rawMessage);

  const iconSpace = 22;

  const labelWidth = measureText(rawLabel, fontSize, 10, "soft") + iconSpace;
  const messageWidth = measureText(rawMessage, fontSize, 10, "soft");

  const width = labelWidth + messageWidth;

  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="6"
      fill="${safeColor(options.labelColor, "#334155")}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      fill="${safeColor(options.messageColor, "#16a34a")}"
    />

    ${coverageIcon(height)}

    <rect
      x="${labelWidth + 5}"
      y="${height - 4}"
      width="${Math.max(4, Math.min(messageWidth - 10, messageWidth - 4))}"
      height="2"
      rx="1"
      fill="#ffffff"
      fill-opacity=".35"
    />

    ${text(
      iconSpace + (labelWidth - iconSpace) / 2,
      height / 2,
      label,
      safeColor(options.textColor, "#ffffff"),
      fontSize,
      600,
    )}

    ${text(
      labelWidth + messageWidth / 2,
      height / 2,
      message,
      safeColor(options.textColor, "#ffffff"),
      fontSize,
      700,
    )}
    `,
  );
}

// ═══════════════════════════════════════
// Icon split
// ═══════════════════════════════════════

function renderIconSplitTemplate(
  options: BadgeOptions,
  icon: string,
  config: {
    labelColor: string;
    messageColor: string;
    radius: number;
    labelWeight: number;
    messageWeight: number;
  },
): string {
  const height = clamp(options.height, 18, 48);
  const fontSize = clamp(options.fontSize, 8, 18);

  const rawLabel = String(options.label ?? "");
  const rawMessage = String(options.message ?? "");

  const label = escapeXml(rawLabel);
  const message = escapeXml(rawMessage);

  const hasIcon = icon.trim().length > 0;

const iconSize = Math.min(16, height - 4);
const iconSpace = hasIcon ? 24 : 0;

  const labelWidth =
    measureText(rawLabel, fontSize, 9, "flat") + iconSpace;

  const messageWidth =
    measureText(rawMessage, fontSize, 9, "flat");

  const width = labelWidth + messageWidth;

  const labelColor = safeColor(
    options.labelColor,
    config.labelColor,
  );

  const messageColor = safeColor(
    options.messageColor,
    config.messageColor,
  );

  const textColor = safeColor(
    options.textColor,
    "#ffffff",
  );

  const bridgeWidth = Math.min(
    config.radius,
    labelWidth,
  );

  const bridgeX = Math.max(
    0,
    labelWidth - bridgeWidth,
  );

  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="${config.radius}"
      fill="${labelColor}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      fill="${messageColor}"
    />

    <rect
      x="${bridgeX}"
      width="${bridgeWidth}"
      height="${height}"
      fill="${messageColor}"
    />

${hasIcon ? icon.replace(/width="[^"]*"/, `width="${iconSize}"`).replace(/height="[^"]*"/, `height="${iconSize}"`) : ""}

    ${text(
      hasIcon
        ? iconSpace + (labelWidth - iconSpace) / 2
        : labelWidth / 2,
      height / 2,
      label,
      textColor,
      fontSize,
      config.labelWeight,
    )}

    ${text(
      labelWidth + messageWidth / 2,
      height / 2,
      message,
      textColor,
      fontSize,
      config.messageWeight,
    )}
    `,
  );
}

// ═══════════════════════════════════════
// Icon status
// ═══════════════════════════════════════

function renderIconStatusTemplate(
  options: BadgeOptions,
  icon: string,
  title: string,
): string {
  const height = clamp(options.height, 20, 48);
  const fontSize = clamp(options.fontSize, 8, 18);

  const message = escapeXml(String(options.message ?? ""));

  const iconSpace = 22;

  const labelWidth = measureText(title, fontSize, 10, "flat") + iconSpace;
  const messageWidth = measureText(String(options.message ?? ""), fontSize, 10, "flat");

  const width = labelWidth + messageWidth;

  const radius = 6;
  const labelColor = safeColor(options.labelColor, "#1e293b");
  const messageColor = safeColor(options.messageColor, "#22c55e");
  const textColor = safeColor(options.textColor, "#ffffff");

  const bridgeWidth = Math.min(radius, labelWidth);
  const bridgeX = Math.max(0, labelWidth - bridgeWidth);

  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${labelColor}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      fill="${messageColor}"
    />

    <rect
      x="${bridgeX}"
      width="${bridgeWidth}"
      height="${height}"
      fill="${messageColor}"
    />

    ${icon}

    ${text(
      iconSpace + (labelWidth - iconSpace) / 2,
      height / 2,
      title,
      textColor,
      fontSize,
      700,
    )}

    ${text(
      labelWidth + messageWidth / 2,
      height / 2,
      message,
      textColor,
      fontSize,
      700,
    )}
    `,
  );
}

// ═══════════════════════════════════════
// Icon metric
// ═══════════════════════════════════════

function renderIconMetricTemplate(
  options: BadgeOptions,
  icon: string,
  title: string,
): string {
  const height = clamp(options.height, 20, 48);
  const fontSize = clamp(options.fontSize, 8, 18);

  const message = escapeXml(String(options.message ?? ""));

  const iconSpace = 22;

  const labelWidth = measureText(title, fontSize, 10, "flat") + iconSpace;
  const messageWidth = measureText(String(options.message ?? ""), fontSize, 10, "flat");

  const width = labelWidth + messageWidth;

  const radius = 6;
  const labelColor = safeColor(options.labelColor, "#0f172a");
  const messageColor = safeColor(options.messageColor, "#2563eb");
  const textColor = safeColor(options.textColor, "#ffffff");

  const bridgeWidth = Math.min(radius, labelWidth);
  const bridgeX = Math.max(0, labelWidth - bridgeWidth);

  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${labelColor}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      fill="${messageColor}"
    />

    <rect
      x="${bridgeX}"
      width="${bridgeWidth}"
      height="${height}"
      fill="${messageColor}"
    />

    ${icon}

    ${text(
      iconSpace + (labelWidth - iconSpace) / 2,
      height / 2,
      title,
      textColor,
      Math.max(8, fontSize - 1),
      700,
    )}

    ${text(
      labelWidth + messageWidth / 2,
      height / 2,
      message,
      textColor,
      fontSize + 1,
      700,
    )}
    `,
  );
}

// ═══════════════════════════════════════
// Template icons
// ═══════════════════════════════════════

function githubIcon(height: number): string {
  const y = (height - 16) / 2;

  return `
    <g transform="translate(4 ${y}) scale(.58)" fill="#ffffff">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.44c1.02.01 2.05.14 3.01.42 2.3-1.56 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.28c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12C24 5.37 18.63 0 12 0Z"/>
    </g>
  `;
}

function npmIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g transform="translate(4 ${y})">
      <rect x="0" y="0" width="16" height="14" rx="1" fill="#ffffff" />
      <text
        x="8"
        y="7"
        fill="#cb3837"
        font-family="Arial,sans-serif"
        font-size="7"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="middle"
      >npm</text>
    </g>
  `;
}

function modrinthIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g transform="translate(4 ${y})">
      <path d="M7 0a7 7 0 1 0 7 7A7 7 0 0 0 7 0Zm0 2a5 5 0 0 1 4.9 4H7a1 1 0 1 0 0 2h4.9A5 5 0 1 1 7 2Z" fill="#ffffff" />
      <circle cx="7" cy="7" r="1.5" fill="#1bd96a" />
    </g>
  `;
}

function discordIcon(height: number): string {
  const y = (height - 13) / 2;

  return `
    <g transform="translate(4 ${y})">
      <path d="M12.5 1.5A11.2 11.2 0 0 0 9.7.6L9.3 1.4a10.3 10.3 0 0 0-4.6 0L4.3.6a11.2 11.2 0 0 0-2.8.9C-.2 4.1-.7 6.6-.5 9.1A11.5 11.5 0 0 0 3 10.8l.8-1.1c-.5-.2-1-.5-1.4-.8l.3-.2a8.1 8.1 0 0 0 8.6 0l.3.2c-.4.3-.9.6-1.4.8l.8 1.1a11.5 11.5 0 0 0 3.5-1.7c.3-3-.2-5.5-1.9-7.6ZM5 7.3c-.8 0-1.5-.7-1.5-1.6S4.2 4.1 5 4.1s1.5.7 1.5 1.6S5.8 7.3 5 7.3Zm4 0c-.8 0-1.5-.7-1.5-1.6S8.2 4.1 9 4.1s1.5.7 1.5 1.6S9.8 7.3 9 7.3Z" fill="#ffffff" />
    </g>
  `;
}

function checkIcon(height: number): string {
  const cy = height / 2;
  const iconCy = cy - 1;

  return `
    <circle cx="11" cy="${iconCy}" r="6" fill="#22c55e" />
    <path
      d="M8 11l2 2 4-4"
      transform="translate(0 ${iconCy - 11})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  `;
}

function downloadIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g
      transform="translate(5 ${y})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M7 1v8"/>
      <path d="m3.5 6 3.5 3.5L10.5 6"/>
      <path d="M2 12h10"/>
    </g>
  `;
}

function versionIcon(height: number): string {
  const cy = height / 2;

  return `
    <text
      x="11"
      y="${cy}"
      fill="#ffffff"
      font-family="Arial,sans-serif"
      font-size="11"
      font-weight="700"
      text-anchor="middle"
      dominant-baseline="middle"
    >v</text>
  `;
}

function licenseIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g
      transform="translate(5 ${y})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.5"
    >
      <circle cx="7" cy="7" r="5.5"/>
      <path d="M7 4v6"/>
      <path d="M4 7h6"/>
    </g>
  `;
}

function releaseIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g
      transform="translate(5 ${y})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M7 1v12"/>
      <path d="M3 5h8"/>
      <path d="m9 3 2 2-2 2"/>
      <path d="m5 9-2 2 2 2"/>
    </g>
  `;
}

function openSourceIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g
      transform="translate(5 ${y})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.6"
      stroke-linecap="round"
    >
      <circle cx="7" cy="7" r="5.5"/>
      <path d="M4 7h6"/>
      <path d="M7 4v6"/>
    </g>
  `;
}

function documentationIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g
      transform="translate(5 ${y})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.5"
    >
      <path d="M2 2.5h4.5A2.5 2.5 0 0 1 9 5v7H4.5A2.5 2.5 0 0 0 2 14Z"/>
      <path d="M12 2.5H7.5A2.5 2.5 0 0 0 5 5v7h4.5A2.5 2.5 0 0 1 12 14Z"/>
    </g>
  `;
}

function websiteIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g
      transform="translate(5 ${y})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.5"
    >
      <circle cx="7" cy="7" r="5.5"/>
      <path d="M1.5 7h11"/>
      <path d="M7 1.5c1.7 1.5 2.5 3.3 2.5 5.5S8.7 11 7 12.5"/>
      <path d="M7 1.5C5.3 3 4.5 4.8 4.5 7S5.3 11 7 12.5"/>
    </g>
  `;
}

function securityIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g
      transform="translate(5 ${y})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.5"
    >
      <path
        d="M7 1 12 3v4.5c0 3-2 5.2-5 6.5-3-1.3-5-3.5-5-6.5V3z"
        fill="#22c55e"
        stroke="none"
      />
      <path
        d="m4.5 7 2 2 4-4"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  `;
}

function coverageIcon(height: number): string {
  const y = (height - 14) / 2;

  return `
    <g
      transform="translate(5 ${y})"
      fill="none"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
    >
      <rect x="1" y="1" width="12" height="12" rx="2"/>
      <path d="M4 10V7"/>
      <path d="M7 10V5"/>
      <path d="M10 10V3"/>
    </g>
  `;
}

// ═══════════════════════════════════════
// Flat
// ═══════════════════════════════════════

function renderFlat(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const bridgeWidth = Math.min(radius, labelWidth);
  const bridgeX = Math.max(0, labelWidth - bridgeWidth);

  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${colors.label}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      rx="${radius}"
      fill="${colors.message}"
    />

    <rect
      x="${bridgeX}"
      width="${bridgeWidth}"
      height="${height}"
      fill="${colors.message}"
    />

    ${text(labelWidth / 2, textY, label, colors.text, fontSize, 400)}

    ${text(labelWidth + messageWidth / 2, textY, message, colors.text, fontSize, 600)}
    `,
  );
}

// ═══════════════════════════════════════
// Plastic
// ═══════════════════════════════════════

function renderPlastic(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const gradientId = id("plastic");

  const bridgeWidth = Math.min(radius, labelWidth);
  const bridgeX = Math.max(0, labelWidth - bridgeWidth);

  return svg(
    width,
    height,
    `
    <defs>
      <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity=".22"/>
        <stop offset="48%" stop-color="#fff" stop-opacity=".04"/>
        <stop offset="52%" stop-color="#000" stop-opacity=".04"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".12"/>
      </linearGradient>
    </defs>

    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${colors.label}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      rx="${radius}"
      fill="${colors.message}"
    />

    <rect
      x="${bridgeX}"
      width="${bridgeWidth}"
      height="${height}"
      fill="${colors.message}"
    />

    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="url(#${gradientId})"
    />

    ${text(labelWidth / 2, textY, label, colors.text, fontSize, 400)}

    ${text(labelWidth + messageWidth / 2, textY, message, colors.text, fontSize, 400)}
    `,
  );
}

// ═══════════════════════════════════════
// For The Badge
// ═══════════════════════════════════════

function renderForTheBadge(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const bridgeWidth = Math.min(radius, labelWidth);
  const bridgeX = Math.max(0, labelWidth - bridgeWidth);

  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${colors.label}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      rx="${radius}"
      fill="${colors.message}"
    />

    <rect
      x="${bridgeX}"
      width="${bridgeWidth}"
      height="${height}"
      fill="${colors.message}"
    />

    ${text(labelWidth / 2, textY, label.toUpperCase(), colors.text, fontSize, 700, 0.6)}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message.toUpperCase(),
      colors.text,
      fontSize,
      700,
      0.6,
    )}
    `,
  );
}

// ═══════════════════════════════════════
// Social
// ═══════════════════════════════════════

function renderSocial(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const bridgeWidth = Math.min(radius, labelWidth);
  const bridgeX = Math.max(0, labelWidth - bridgeWidth);

  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${colors.label}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      rx="${radius}"
      fill="${colors.message}"
    />

    <rect
      x="${bridgeX}"
      width="${bridgeWidth}"
      height="${height}"
      fill="${colors.message}"
    />

    ${text(labelWidth / 2, textY, label, colors.text, fontSize, 600)}

    ${text(labelWidth + messageWidth / 2, textY, message, colors.text, fontSize, 600)}
    `,
  );
}

// ═══════════════════════════════════════
// Minimal
// ═══════════════════════════════════════

function renderMinimal(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  return svg(
    width,
    height,
    `
    ${text(5, textY, label, colors.text, fontSize, 400, 0, "start")}

    ${text(width - 5, textY, message, colors.message, fontSize, 600, 0, "end")}
    `,
  );
}

// ═══════════════════════════════════════
// Transparent
// ═══════════════════════════════════════

function renderTransparent(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  return svg(
    width,
    height,
    `
    ${text(5, textY, label, colors.text, fontSize, 400, 0, "start")}

    ${text(width - 5, textY, message, colors.message, fontSize, 600, 0, "end")}
    `,
  );
}

// ═══════════════════════════════════════
// Outline
// ═══════════════════════════════════════

function renderOutline(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  return svg(
    width,
    height,
    `
    <rect
      x=".75"
      y=".75"
      width="${Math.max(0, width - 1.5)}"
      height="${Math.max(0, height - 1.5)}"
      rx="${radius}"
      fill="none"
      stroke="${colors.message}"
      stroke-width="1.5"
    />

    ${text(labelWidth / 2, textY, label, colors.text, fontSize, 400)}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.message,
      fontSize,
      600,
    )}
    `,
  );
}

// ═══════════════════════════════════════
// Soft
// ═══════════════════════════════════════

function renderSoft(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const clipId = id("soft");

  return svg(
    width,
    height,
    `
    <defs>
      <clipPath id="${clipId}">
        <rect width="${width}" height="${height}" rx="${radius}" />
      </clipPath>
    </defs>

    <g clip-path="url(#${clipId})">
      <rect width="${width}" height="${height}" fill="${colors.message}" fill-opacity=".10" />
      <rect width="${labelWidth}" height="${height}" fill="${colors.label}" fill-opacity=".14" />
    </g>

    ${text(labelWidth / 2, textY, label, colors.label, fontSize, 500)}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.message,
      fontSize,
      600,
    )}
    `,
  );
}

// ═══════════════════════════════════════
// Gradient
// ═══════════════════════════════════════

function renderGradient(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const gradientId = id("gradient");

  return svg(
    width,
    height,
    `
    <defs>
      <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${colors.label}" />
        <stop offset="100%" stop-color="${colors.message}" />
      </linearGradient>
    </defs>

    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="url(#${gradientId})"
    />

    ${text(labelWidth / 2, textY, label, colors.text, fontSize, 500)}

    ${text(labelWidth + messageWidth / 2, textY, message, colors.text, fontSize, 600)}
    `,
  );
}

// ═══════════════════════════════════════
// Dot
// ═══════════════════════════════════════

function renderDot(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  return svg(
    width,
    height,
    `
    <circle cx="8" cy="${height / 2}" r="3.5" fill="${colors.message}" />

    ${text(16, textY, label, colors.text, fontSize, 400, 0, "start")}

    ${text(width - 5, textY, message, colors.message, fontSize, 600, 0, "end")}
    `,
  );
}

// ═══════════════════════════════════════
// Glass
// ═══════════════════════════════════════

function renderGlass(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const gradientId = id("glass");
  const clipId = id("glass-clip");

  return svg(
    width,
    height,
    `
    <defs>
      <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity=".30" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity=".08" />
      </linearGradient>

      <clipPath id="${clipId}">
        <rect width="${width}" height="${height}" rx="${radius}" />
      </clipPath>
    </defs>

    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${colors.message}"
      fill-opacity=".16"
      stroke="#ffffff"
      stroke-opacity=".35"
    />

    <g clip-path="url(#${clipId})">
      <rect width="${width}" height="${height / 2}" fill="url(#${gradientId})" />
    </g>

    ${text(labelWidth / 2, textY, label, colors.text, fontSize, 500)}

    ${text(labelWidth + messageWidth / 2, textY, message, colors.text, fontSize, 600)}
    `,
  );
}

// ═══════════════════════════════════════
// Neon
// ═══════════════════════════════════════

function renderNeon(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const filterId = id("neon");

  return svg(
    width,
    height,
    `
    <defs>
      <filter id="${filterId}" x="-30%" y="-100%" width="160%" height="300%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <rect
      x=".75"
      y=".75"
      width="${Math.max(0, width - 1.5)}"
      height="${Math.max(0, height - 1.5)}"
      rx="${radius}"
      fill="#0b1020"
    />

    <rect
      x=".75"
      y=".75"
      width="${Math.max(0, width - 1.5)}"
      height="${Math.max(0, height - 1.5)}"
      rx="${radius}"
      fill="none"
      stroke="${colors.message}"
      stroke-width="1.5"
      filter="url(#${filterId})"
    />

    ${text(labelWidth / 2, textY, label, colors.text, fontSize, 600)}

    ${text(labelWidth + messageWidth / 2, textY, message, colors.message, fontSize, 700)}
    `,
  );
}

// ═══════════════════════════════════════
// Mono
// ═══════════════════════════════════════

function renderMono(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  void colors;

  return svg(
    width,
    height,
    `
    <rect width="${width}" height="${height}" rx="${radius}" fill="#171717" />

    ${text(labelWidth / 2, textY, label, "#ffffff", fontSize, 500, 0.3, "middle", "monospace")}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      "#ffffff",
      fontSize,
      700,
      0.3,
      "middle",
      "monospace",
    )}
    `,
  );
}

// ═══════════════════════════════════════
// Elevated
// ═══════════════════════════════════════

function renderElevated(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  const filterId = id("shadow");

  const bridgeWidth = Math.min(radius, labelWidth);
  const bridgeX = Math.max(0, labelWidth - bridgeWidth);

  return svg(
    width,
    height + 3,
    `
    <defs>
      <filter id="${filterId}" x="-10%" y="-20%" width="120%" height="150%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity=".22" />
      </filter>
    </defs>

    <g filter="url(#${filterId})">
      <rect width="${width}" height="${height}" rx="${radius}" fill="${colors.label}" />

      <rect
        x="${labelWidth}"
        width="${messageWidth}"
        height="${height}"
        rx="${radius}"
        fill="${colors.message}"
      />

      <rect
        x="${bridgeX}"
        width="${bridgeWidth}"
        height="${height}"
        fill="${colors.message}"
      />

      ${text(labelWidth / 2, textY, label, colors.text, fontSize, 400)}

      ${text(labelWidth + messageWidth / 2, textY, message, colors.text, fontSize, 600)}
    </g>
    `,
  );
}

// ═══════════════════════════════════════
// Inset
// ═══════════════════════════════════════

function renderInset(
  width: number,
  height: number,
  textY: number,
  fontSize: number,
  radius: number,
  labelWidth: number,
  messageWidth: number,
  label: string,
  message: string,
  colors: Colors,
): string {
  return svg(
    width,
    height,
    `
    <rect width="${width}" height="${height}" rx="${radius}" fill="${colors.label}" />

    <rect
      x="1"
      y="1"
      width="${Math.max(0, width - 2)}"
      height="${Math.max(0, height - 2)}"
      rx="${Math.max(0, radius - 1)}"
      fill="none"
      stroke="#000000"
      stroke-opacity=".22"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      rx="${radius}"
      fill="${colors.message}"
    />

    <rect
      x="${labelWidth + 1}"
      y="1"
      width="${Math.max(0, messageWidth - 2)}"
      height="${Math.max(0, height - 2)}"
      rx="${Math.max(0, radius - 1)}"
      fill="none"
      stroke="#000000"
      stroke-opacity=".18"
    />

    ${text(labelWidth / 2, textY, label, colors.text, fontSize, 400)}

    ${text(labelWidth + messageWidth / 2, textY, message, colors.text, fontSize, 600)}
    `,
  );
}

// ═══════════════════════════════════════
// Helpers
// ═══════════════════════════════════════

interface Colors {
  label: string;
  message: string;
  text: string;
}

function getPadding(style: BadgeOptions["style"]): number {
  switch (style) {
    case "compact":
      return 6;
    case "for-the-badge":
      return 12;
    case "social":
      return 10;
    case "dot":
      return 5;
    case "minimal":
    case "transparent":
      return 5;
    default:
      return 9;
  }
}

function measureText(
  value: string,
  fontSize: number,
  padding: number,
  style: BadgeOptions["style"],
): number {
  const weightFactor =
    style === "for-the-badge" || style === "neon" ? 0.66 : 0.61;

  const letterSpacing =
    style === "for-the-badge" ? 0.6 : style === "mono" ? 0.3 : 0;

  const estimated =
    value.length * fontSize * weightFactor +
    Math.max(0, value.length - 1) * letterSpacing;

  return Math.max(
    style === "dot" ? 34 : 30,
    Math.ceil(estimated + padding * 2),
  );
}

function text(
  x: number,
  y: number,
  value: string,
  fill: string,
  fontSize: number,
  fontWeight = 400,
  letterSpacing = 0,
  anchor: "start" | "middle" | "end" = "middle",
  fontFamily = "Arial,sans-serif",
): string {
  return `
    <text
      x="${round(x)}"
      y="${round(y)}"
      fill="${fill}"
      font-family="${fontFamily}"
      font-size="${fontSize}"
      font-weight="${fontWeight}"
      letter-spacing="${letterSpacing}px"
      text-anchor="${anchor}"
      dominant-baseline="middle"
      text-rendering="optimizeLegibility"
    >${value}</text>
  `;
}

function svg(
  width: number,
  height: number,
  body: string,
  ariaLabel = "Laibo badge",
): string {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${round(width)}"
  height="${round(height)}"
  viewBox="0 0 ${round(width)} ${round(height)}"
  role="img"
  aria-label="${escapeXml(ariaLabel)}"
  text-rendering="optimizeLegibility">
  <title>${escapeXml(ariaLabel)}</title>
  ${body}
</svg>`;
}

function safeColor(value: string, fallback: string): string {
  const color = String(value ?? "").trim();

  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) {
    return color;
  }

  if (/^[a-zA-Z]+$/.test(color)) {
    return color;
  }

  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

let idCounter = 0;

function id(prefix: string): string {
  idCounter += 1;
  return `laibo-${prefix}-${idCounter}`;
}