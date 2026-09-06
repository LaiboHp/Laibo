import type { BadgeOptions } from "./types";

export function renderBadge(options: BadgeOptions): string {
  const label = escapeXml(options.label);
  const message = escapeXml(options.message);

  const style = options.style;
  const height = clamp(options.height, 16, 48);
  const radius =
    style === "pill"
      ? height / 2
      : style === "flat-square"
        ? 0
        : clamp(options.radius, 0, 20);

  const fontSize =
    style === "for-the-badge"
      ? Math.max(10, options.fontSize + 1)
      : clamp(options.fontSize, 8, 18);

  const padding =
    style === "compact"
      ? 7
      : style === "for-the-badge"
        ? 12
        : 10;

  const labelWidth = Math.max(
    30,
    Math.ceil(label.length * fontSize * 0.62 + padding * 2)
  );

  const messageWidth = Math.max(
    30,
    Math.ceil(message.length * fontSize * 0.62 + padding * 2)
  );

  const width = labelWidth + messageWidth;

  const textY = height / 2 + fontSize * 0.35;

  if (style === "minimal" || style === "transparent") {
    const minimalWidth = labelWidth + messageWidth;

    return svg(
      minimalWidth,
      height,
      `
      <text x="8" y="${textY}" fill="${safeColor(
        options.textColor,
        "#172033"
      )}" font-family="Arial,sans-serif" font-size="${fontSize}">
        ${label}
      </text>
      <text x="${minimalWidth - 8}" y="${textY}"
        fill="${safeColor(options.messageColor, "#2563eb")}"
        font-family="Arial,sans-serif"
        font-size="${fontSize}"
        text-anchor="end">
        ${message}
      </text>
      `
    );
  }

  if (style === "dot") {
    return svg(
      width,
      height,
      `
      <circle cx="10" cy="${height / 2}" r="4"
        fill="${safeColor(options.messageColor, "#22c55e")}"/>
      <text x="20" y="${textY}"
        fill="${safeColor(options.textColor, "#172033")}"
        font-family="Arial,sans-serif"
        font-size="${fontSize}">
        ${label}: ${message}
      </text>
      `
    );
  }

  if (style === "outline") {
    return svg(
      width,
      height,
      `
      <rect
        x="0.75"
        y="0.75"
        width="${width - 1.5}"
        height="${height - 1.5}"
        rx="${radius}"
        fill="none"
        stroke="${safeColor(options.messageColor, "#2563eb")}"
      />
      <text x="${labelWidth / 2}" y="${textY}"
        fill="${safeColor(options.textColor, "#172033")}"
        font-family="Arial,sans-serif"
        font-size="${fontSize}"
        text-anchor="middle">
        ${label}
      </text>
      <text x="${labelWidth + messageWidth / 2}" y="${textY}"
        fill="${safeColor(options.messageColor, "#2563eb")}"
        font-family="Arial,sans-serif"
        font-size="${fontSize}"
        text-anchor="middle">
        ${message}
      </text>
      `
    );
  }

  const labelColor = safeColor(options.labelColor, "#475569");
  const messageColor = safeColor(options.messageColor, "#2563eb");
  const textColor = safeColor(options.textColor, "#ffffff");

  const labelFill =
    style === "soft" || style === "glass"
      ? labelColor
      : labelColor;

  const messageFill =
    style === "soft"
      ? messageColor
      : messageColor;

  const opacity =
    style === "soft"
      ? 0.14
      : style === "glass"
        ? 0.2
        : 1;

  const actualTextColor =
    style === "soft"
      ? safeColor(options.messageColor, "#2563eb")
      : textColor;

  const gradient =
    style === "gradient"
      ? `
      <defs>
        <linearGradient id="laibo-gradient" x1="0" x2="1">
          <stop offset="0%" stop-color="${labelColor}"/>
          <stop offset="100%" stop-color="${messageColor}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}"
        rx="${radius}" fill="url(#laibo-gradient)"/>
      `
      : `
      <rect width="${labelWidth}" height="${height}"
        fill="${labelFill}" opacity="${opacity}"/>
      <rect x="${labelWidth}" width="${messageWidth}"
        height="${height}" fill="${messageFill}" opacity="${opacity}"/>
      `;

  const shadow =
    style === "elevated"
      ? `
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="2"
          flood-opacity=".18"/>
      </filter>
      <rect width="${width}" height="${height}"
        rx="${radius}" fill="white"
        opacity=".001" filter="url(#shadow)"/>
      `
      : "";

  const fontWeight =
    style === "for-the-badge" || style === "neon"
      ? 700
      : 400;

  return svg(
    width,
    height,
    `
    ${gradient}
    ${shadow}

    <text
      x="${labelWidth / 2}"
      y="${textY}"
      fill="${actualTextColor}"
      font-family="Arial,sans-serif"
      font-size="${fontSize}"
      font-weight="${fontWeight}"
      text-anchor="middle">
      ${style === "for-the-badge" ? label.toUpperCase() : label}
    </text>

    <text
      x="${labelWidth + messageWidth / 2}"
      y="${textY}"
      fill="${actualTextColor}"
      font-family="Arial,sans-serif"
      font-size="${fontSize}"
      font-weight="${fontWeight}"
      text-anchor="middle">
      ${style === "for-the-badge" ? message.toUpperCase() : message}
    </text>
    `
  );
}

function svg(width: number, height: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg"
width="${width}"
height="${height}"
viewBox="0 0 ${width} ${height}"
role="img">
<title>Laibo badge</title>
${body}
</svg>`;
}

function safeColor(value: string, fallback: string): string {
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value;
  if (/^[a-zA-Z]+$/.test(value)) return value;
  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
