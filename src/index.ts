interface BadgeData {
  label: string;
  message: string;
}

type Metric =
  | "stars"
  | "forks"
  | "issues"
  | "license"
  | "downloads"
  | "followers"
  | "version"
  | "weekly-downloads";

interface GitHubRepository {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: {
    spdx_id: string;
  } | null;
}

interface ModrinthProject {
  title: string;
  downloads: number;
  followers: number;
  slug: string | null;
}

interface NpmPackage {
  name: string;
  "dist-tags"?: {
    latest?: string;
  };
  downloads?: {
    weekly?: number;
  };
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health
    if (path === "/" || path === "/api") {
      return json({
        name: "Laibo",
        status: "ok",
        providers: ["github", "modrinth", "npm", "static"],
      });
    }

    // ─────────────────────────────
    // GitHub
    // /github/owner/repo/stars
    // /api/github/owner/repo/stars
    // ─────────────────────────────

    const github = path.match(
      /^\/(?:api\/)?github\/([^/]+)\/([^/]+)\/(stars|forks|issues|license)$/
    );

    if (github) {
      const [, owner, repo, metric] = github;

      return githubBadge(
        owner,
        repo,
        metric as "stars" | "forks" | "issues" | "license",
        url.searchParams
      );
    }

    // ─────────────────────────────
    // Modrinth
    // /modrinth/project/downloads
    // /modrinth/project/followers
    // /modrinth/project/version
    // ─────────────────────────────

    const modrinth = path.match(
      /^\/(?:api\/)?modrinth\/([^/]+)\/(downloads|followers|version)$/
    );

    if (modrinth) {
      const [, project, metric] = modrinth;

      return modrinthBadge(
        project,
        metric as "downloads" | "followers" | "version",
        url.searchParams
      );
    }

    // ─────────────────────────────
    // npm
    // /npm/downloads/package
    // /npm/weekly-downloads/package
    // /npm/version/package
    // ─────────────────────────────

    const npm = path.match(
      /^\/(?:api\/)?npm\/(downloads|weekly-downloads|version)\/(.+)$/
    );

    if (npm) {
      const [, metric, packageName] = npm;

      return npmBadge(
        decodeURIComponent(packageName),
        metric as "downloads" | "weekly-downloads" | "version",
        url.searchParams
      );
    }

    // ─────────────────────────────
    // Static
    // /static/label/message
    // ─────────────────────────────

    const staticBadge = path.match(
      /^\/(?:api\/)?static\/([^/]+)\/([^/]+)$/
    );

    if (staticBadge) {
      const [, label, message] = staticBadge;

      return createBadgeResponse(
        decodeURIComponent(label),
        decodeURIComponent(message),
        url.searchParams
      );
    }

    return new Response("Not Found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  },
};

// ═══════════════════════════════════════
// GitHub
// ═══════════════════════════════════════

async function githubBadge(
  owner: string,
  repo: string,
  metric: "stars" | "forks" | "issues" | "license",
  params: URLSearchParams
): Promise<Response> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "Laibo",
        },
      }
    );

    if (!response.ok) {
      return createBadgeResponse(
        "github",
        "not found",
        params,
        404
      );
    }

    const data = (await response.json()) as GitHubRepository;

    let value = "";

    switch (metric) {
      case "stars":
        value = formatNumber(data.stargazers_count);
        break;

      case "forks":
        value = formatNumber(data.forks_count);
        break;

      case "issues":
        value = formatNumber(data.open_issues_count);
        break;

      case "license":
        value = data.license?.spdx_id ?? "none";
        break;
    }

    return createBadgeResponse(
      params.get("label") || metric,
      value,
      params
    );
  } catch {
    return createBadgeResponse("github", "error", params, 502);
  }
}

// ═══════════════════════════════════════
// Modrinth
// ═══════════════════════════════════════

async function modrinthBadge(
  project: string,
  metric: "downloads" | "followers" | "version",
  params: URLSearchParams
): Promise<Response> {
  try {
    const response = await fetch(
      `https://api.modrinth.com/v2/project/${encodeURIComponent(project)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Laibo/0.1",
        },
      }
    );

    if (!response.ok) {
      return createBadgeResponse(
        "modrinth",
        "not found",
        params,
        404
      );
    }

    const data = (await response.json()) as ModrinthProject;

    let value = "";

    switch (metric) {
      case "downloads":
        value = formatNumber(data.downloads);
        break;

      case "followers":
        value = formatNumber(data.followers);
        break;

      case "version":
        value = data.slug || "unknown";
        break;
    }

    return createBadgeResponse(
      params.get("label") || metric,
      value,
      params
    );
  } catch {
    return createBadgeResponse("modrinth", "error", params, 502);
  }
}

// ═══════════════════════════════════════
// npm
// ═══════════════════════════════════════

async function npmBadge(
  packageName: string,
  metric: "downloads" | "weekly-downloads" | "version",
  params: URLSearchParams
): Promise<Response> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Laibo/0.1",
        },
      }
    );

    if (!response.ok) {
      return createBadgeResponse(
        "npm",
        "not found",
        params,
        404
      );
    }

    const data = (await response.json()) as NpmPackage;

    let value = "";

    if (metric === "version") {
      value = data["dist-tags"]?.latest || "unknown";
    } else {
      const downloads = await getNpmDownloads(packageName);

      if (metric === "weekly-downloads") {
        value = formatNumber(downloads);
      } else {
        value = formatNumber(downloads);
      }
    }

    return createBadgeResponse(
      params.get("label") || metric,
      value,
      params
    );
  } catch {
    return createBadgeResponse("npm", "error", params, 502);
  }
}

async function getNpmDownloads(
  packageName: string
): Promise<number> {
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(
      packageName
    )}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Laibo/0.1",
      },
    }
  );

  if (!response.ok) {
    return 0;
  }

  const data = (await response.json()) as {
    downloads?: number;
  };

  return data.downloads || 0;
}

// ═══════════════════════════════════════
// Badge
// ═══════════════════════════════════════

function createBadgeResponse(
  label: string,
  message: string,
  params: URLSearchParams,
  status = 200
): Response {
  const svg = createBadge(label, message, params);

  return new Response(svg, {
    status,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",

      "cache-control":
        status === 200
          ? "public, max-age=300, s-maxage=300"
          : "no-cache",

      "access-control-allow-origin": "*",
    },
  });
}

function createBadge(
  label: string,
  message: string,
  params: URLSearchParams
): string {
  const safeLabel = escapeXml(label);
  const safeMessage = escapeXml(message);

  const style = params.get("style") || "flat";

  const labelColor = safeColor(
    params.get("labelColor"),
    "#555"
  );

  const messageColor = safeColor(
    params.get("messageColor") ||
      params.get("color"),
    "#4c1"
  );

  const textColor = safeColor(
    params.get("textColor"),
    "#fff"
  );

  const height = clamp(
    Number(params.get("height") || 20),
    18,
    40
  );

  const radius = clamp(
    Number(params.get("radius") || 3),
    0,
    20
  );

  const labelWidth = Math.max(
    55,
    safeLabel.length * 7 + 20
  );

  const messageWidth = Math.max(
    45,
    safeMessage.length * 7 + 20
  );

  const totalWidth = labelWidth + messageWidth;

  const fontSize =
    height <= 20 ? 11 :
    height <= 24 ? 12 :
    13;

  const textY =
    height / 2 +
    fontSize / 2 -
    2;

  if (style === "minimal") {
    const width = Math.max(
      80,
      safeLabel.length * 7 +
        safeMessage.length * 7 +
        28
    );

    return svgStart(
      width,
      height,
      safeLabel,
      safeMessage
    ) + `
  <text
    x="8"
    y="${textY}"
    fill="${textColor}"
    font-family="Arial,Verdana,sans-serif"
    font-size="${fontSize}"
  >${safeLabel}</text>

  <text
    x="${width - 8}"
    y="${textY}"
    fill="${messageColor}"
    font-family="Arial,Verdana,sans-serif"
    font-size="${fontSize}"
    text-anchor="end"
  >${safeMessage}</text>

</svg>`;
  }

  const actualRadius =
    style === "pill"
      ? height / 2
      : radius;

  return `${svgStart(
    totalWidth,
    height,
    safeLabel,
    safeMessage
  )}

  <clipPath id="clip">
    <rect
      width="${totalWidth}"
      height="${height}"
      rx="${actualRadius}"
    />
  </clipPath>

  <g clip-path="url(#clip)">
    <rect
      width="${labelWidth}"
      height="${height}"
      fill="${labelColor}"
    />

    <rect
      x="${labelWidth}"
      width="${messageWidth}"
      height="${height}"
      fill="${messageColor}"
    />
  </g>

  <text
    x="${labelWidth / 2}"
    y="${textY}"
    fill="${textColor}"
    font-family="Arial,Verdana,sans-serif"
    font-size="${fontSize}"
    text-anchor="middle"
  >${safeLabel}</text>

  <text
    x="${labelWidth + messageWidth / 2}"
    y="${textY}"
    fill="${textColor}"
    font-family="Arial,Verdana,sans-serif"
    font-size="${fontSize}"
    text-anchor="middle"
  >${safeMessage}</text>

</svg>`;
}

function svgStart(
  width: number,
  height: number,
  label: string,
  message: string
): string {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  role="img"
  aria-label="${label}: ${message}"
>
  <title>${label}: ${message}</title>`;
}

// ═══════════════════════════════════════
// Utilities
// ═══════════════════════════════════════

function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000)
      .toFixed(1)
      .replace(/\.0$/, "")}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000)
      .toFixed(1)
      .replace(/\.0$/, "")}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000)
      .toFixed(1)
      .replace(/\.0$/, "")}k`;
  }

  return value.toString();
}

function safeColor(
  value: string | null,
  fallback: string
): string {
  if (!value) {
    return fallback;
  }

  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) {
    return value;
  }

  if (/^[a-zA-Z]+$/.test(value)) {
    return value;
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

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function json(data: unknown): Response {
  return new Response(
    JSON.stringify(data, null, 2),
    {
      headers: {
        "content-type":
          "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
      },
    }
  );
}