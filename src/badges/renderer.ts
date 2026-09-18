import type { BadgeOptions } from "./types";

export function renderBadge(options: BadgeOptions): string {
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

  const colors = {
    label: safeColor(options.labelColor, "#475569"),
    message: safeColor(options.messageColor, "#2563eb"),
    text: safeColor(options.textColor, "#ffffff")
  };

  const padding = getPadding(style);

  const labelWidth = measureText(
    rawLabel,
    fontSize,
    padding,
    style
  );

  const messageWidth = measureText(
    rawMessage,
    fontSize,
    padding,
    style
  );

  const width = labelWidth + messageWidth;

  const textY = height / 2;

  switch (style) {
    case "minimal":
      return renderMinimal(
        width,
        height,
        textY,
        fontSize,
        label,
        message,
        colors
      );

    case "transparent":
      return renderTransparent(
        width,
        height,
        textY,
        fontSize,
        label,
        message,
        colors
      );

    case "dot":
      return renderDot(
        width,
        height,
        textY,
        fontSize,
        label,
        message,
        colors
      );

    case "outline":
      return renderOutline(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "soft":
      return renderSoft(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "gradient":
      return renderGradient(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "compact":
      return renderFlat(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors,
        {
          separator: false
        }
      );

    case "glass":
      return renderGlass(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "neon":
      return renderNeon(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "mono":
      return renderMono(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "elevated":
      return renderElevated(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "inset":
      return renderInset(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "plastic":
      return renderPlastic(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "social":
      return renderSocial(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "for-the-badge":
      return renderForTheBadge(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors
      );

    case "pill":
      return renderFlat(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors,
        {
          separator: false
        }
      );

    case "flat-square":
      return renderFlat(
        width,
        height,
        textY,
        fontSize,
        0,
        labelWidth,
        messageWidth,
        label,
        message,
        colors,
        {
          separator: false
        }
      );

    case "flat":
    default:
      return renderFlat(
        width,
        height,
        textY,
        fontSize,
        radius,
        labelWidth,
        messageWidth,
        label,
        message,
        colors,
        {
          separator: false
        }
      );
  }
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
  options: {
    separator: boolean;
  }
): string {
  const separator = options.separator
    ? `
      <line
        x1="${labelWidth}"
        y1="0"
        x2="${labelWidth}"
        y2="${height}"
        stroke="#000"
        stroke-opacity=".12"
      />`
    : "";

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
      x="${Math.max(0, labelWidth - radius)}"
      width="${radius}"
      height="${height}"
      fill="${colors.message}"
    />

    ${separator}

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.text,
      fontSize,
      400
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.text,
      fontSize,
      400
    )}
    `
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
  colors: Colors
): string {
  const gradientId = id("plastic");

  return svg(
    width,
    height,
    `
    <defs>
      <linearGradient
        id="${gradientId}"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
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
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="url(#${gradientId})"
    />

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.text,
      fontSize,
      400
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.text,
      fontSize,
      400
    )}
    `
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
  colors: Colors
): string {
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
      x="${labelWidth - radius}"
      width="${radius}"
      height="${height}"
      fill="${colors.message}"
    />

    ${text(
      labelWidth / 2,
      textY,
      label.toUpperCase(),
      colors.text,
      fontSize,
      700,
      0.6
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message.toUpperCase(),
      colors.text,
      fontSize,
      700,
      0.6
    )}
    `
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
  colors: Colors
): string {
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
      x="${labelWidth - radius}"
      width="${radius}"
      height="${height}"
      fill="${colors.message}"
    />

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.text,
      fontSize,
      600
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.text,
      fontSize,
      600
    )}
    `
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
  colors: Colors
): string {
  return svg(
    width,
    height,
    `
    ${text(
      5,
      textY,
      label,
      colors.text,
      fontSize,
      400,
      0,
      "start"
    )}

    ${text(
      width - 5,
      textY,
      message,
      colors.message,
      fontSize,
      600,
      0,
      "end"
    )}
    `
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
  colors: Colors
): string {
  return svg(
    width,
    height,
    `
    ${text(
      5,
      textY,
      label,
      colors.text,
      fontSize,
      400,
      0,
      "start"
    )}

    ${text(
      width - 5,
      textY,
      message,
      colors.message,
      fontSize,
      600,
      0,
      "end"
    )}
    `
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
  colors: Colors
): string {
  return svg(
    width,
    height,
    `
    <rect
      x=".75"
      y=".75"
      width="${width - 1.5}"
      height="${height - 1.5}"
      rx="${radius}"
      fill="none"
      stroke="${colors.message}"
      stroke-width="1.5"
    />

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.text,
      fontSize,
      400
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.message,
      fontSize,
      600
    )}
    `
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
  colors: Colors
): string {
  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${colors.message}"
      fill-opacity=".10"
    />

    <rect
      width="${labelWidth}"
      height="${height}"
      rx="${radius}"
      fill="${colors.label}"
      fill-opacity=".10"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      fill="${colors.message}"
      fill-opacity=".10"
    />

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.label,
      fontSize,
      500
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.message,
      fontSize,
      600
    )}
    `
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
  colors: Colors
): string {
  const gradientId = id("gradient");

  return svg(
    width,
    height,
    `
    <defs>
      <linearGradient
        id="${gradientId}"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop
          offset="0%"
          stop-color="${colors.label}"
        />
        <stop
          offset="100%"
          stop-color="${colors.message}"
        />
      </linearGradient>
    </defs>

    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="url(#${gradientId})"
    />

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.text,
      fontSize,
      500
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.text,
      fontSize,
      600
    )}
    `
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
  colors: Colors
): string {
  return svg(
    width,
    height,
    `
    <circle
      cx="8"
      cy="${height / 2}"
      r="3.5"
      fill="${colors.message}"
    />

    ${text(
      16,
      textY,
      label,
      colors.text,
      fontSize,
      400,
      0,
      "start"
    )}

    ${text(
      width - 5,
      textY,
      message,
      colors.message,
      fontSize,
      600,
      0,
      "end"
    )}
    `
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
  colors: Colors
): string {
  const gradientId = id("glass");

  return svg(
    width,
    height,
    `
    <defs>
      <linearGradient
        id="${gradientId}"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop
          offset="0%"
          stop-color="#ffffff"
          stop-opacity=".30"
        />
        <stop
          offset="100%"
          stop-color="#ffffff"
          stop-opacity=".08"
        />
      </linearGradient>
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

    <rect
      width="${width}"
      height="${height / 2}"
      rx="${radius}"
      fill="url(#${gradientId})"
    />

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.text,
      fontSize,
      500
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.text,
      fontSize,
      600
    )}
    `
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
  colors: Colors
): string {
  const filterId = id("neon");

  return svg(
    width,
    height,
    `
    <defs>
      <filter
        id="${filterId}"
        x="-30%"
        y="-100%"
        width="160%"
        height="300%"
      >
        <feGaussianBlur
          stdDeviation="2"
          result="blur"
        />

        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <rect
      x=".75"
      y=".75"
      width="${width - 1.5}"
      height="${height - 1.5}"
      rx="${radius}"
      fill="#0b1020"
      stroke="${colors.message}"
      stroke-width="1.5"
      filter="url(#${filterId})"
    />

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.text,
      fontSize,
      600
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.message,
      fontSize,
      700
    )}
    `
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
  colors: Colors
): string {
  return svg(
    width,
    height,
    `
    <rect
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="#171717"
    />

    ${text(
      labelWidth / 2,
      textY,
      label,
      "#ffffff",
      fontSize,
      500,
      0.3,
      "middle",
      "monospace"
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      "#ffffff",
      fontSize,
      700,
      0.3,
      "middle",
      "monospace"
    )}
    `
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
  colors: Colors
): string {
  const filterId = id("shadow");

  return svg(
    width,
    height + 3,
    `
    <defs>
      <filter
        id="${filterId}"
        x="-10%"
        y="-20%"
        width="120%"
        height="150%"
      >
        <feDropShadow
          dx="0"
          dy="2"
          stdDeviation="1.5"
          flood-color="#000000"
          flood-opacity=".22"
        />
      </filter>
    </defs>

    <g filter="url(#${filterId})">
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
        x="${labelWidth - radius}"
        width="${radius}"
        height="${height}"
        fill="${colors.message}"
      />

      ${text(
        labelWidth / 2,
        textY,
        label,
        colors.text,
        fontSize,
        400
      )}

      ${text(
        labelWidth + messageWidth / 2,
        textY,
        message,
        colors.text,
        fontSize,
        600
      )}
    </g>
    `
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
  colors: Colors
): string {
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
      x="1"
      y="1"
      width="${width - 2}"
      height="${height - 2}"
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

    ${text(
      labelWidth / 2,
      textY,
      label,
      colors.text,
      fontSize,
      400
    )}

    ${text(
      labelWidth + messageWidth / 2,
      textY,
      message,
      colors.text,
      fontSize,
      600
    )}
    `
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
      return 8;

    case "minimal":
    case "transparent":
      return 7;

    default:
      return 9;
  }
}

function measureText(
  value: string,
  fontSize: number,
  padding: number,
  style: BadgeOptions["style"]
): number {
  const weightFactor =
    style === "for-the-badge" || style === "neon"
      ? 0.66
      : 0.61;

  const letterSpacing =
    style === "for-the-badge"
      ? 1
      : style === "mono"
        ? 0.25
        : 0;

  const estimated =
    value.length * fontSize * weightFactor +
    Math.max(0, value.length - 1) * letterSpacing;

  return Math.max(
    style === "dot" ? 34 : 30,
    Math.ceil(estimated + padding * 2)
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
  fontFamily = "Arial,sans-serif"
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
      text-rendering="optimizeLegibility">${value}</text>
  `;
}

function svg(
  width: number,
  height: number,
  body: string
): string {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${round(width)}"
  height="${round(height)}"
  viewBox="0 0 ${round(width)} ${round(height)}"
  role="img"
  aria-label="Laibo badge"
  text-rendering="optimizeLegibility">
  <title>Laibo badge</title>
  ${body}
</svg>`;
}

function safeColor(
  value: string,
  fallback: string
): string {
  const color = String(value ?? "").trim();

  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) {
    return color;
  }

  if (/^[a-zA-Z]+$/.test(color)) {
    return color;
  }

  return fallback;
}

function clamp(
  value: number,
  min: number,
  max: number
): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(
    max,
    Math.max(min, value)
  );
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function id(prefix: string): string {
  const random = Math.random()
    .toString(36)
    .slice(2, 8);

  return `laibo-${prefix}-${random}`;
}
