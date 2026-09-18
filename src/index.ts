import { renderBadge } from "./badges/renderer";
import type { BadgeStyle } from "./badges/types";

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
  latest_version?: string | null;
}

interface NpmPackage {
  name: string;
  "dist-tags"?: {
    latest?: string;
  };
}

// ═══════════════════════════════════════
// Worker
// ═══════════════════════════════════════

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ═══════════════════════════════════════
    // Health
    // ═══════════════════════════════════════

    if (path === "/") {
      return json({
        name: "Laibo",
        status: "ok",
        providers: [
          "github",
          "modrinth",
          "npm",
          "static",
        ],
      });
    }

    // ═══════════════════════════════════════
    // API - GitHub
    // /api/github/owner/repo/stars
    // ═══════════════════════════════════════

    const githubApi = path.match(
      /^\/api\/github\/([^/]+)\/([^/]+)\/(stars|forks|issues|license)$/
    );

    if (githubApi) {
      const [, owner, repo, metric] = githubApi;

      return githubApiResponse(
        owner,
        repo,
        metric as "stars" | "forks" | "issues" | "license"
      );
    }

    // ═══════════════════════════════════════
    // Badge - GitHub
    // /github/owner/repo/stars
    // ═══════════════════════════════════════

    const githubBadgeRoute = path.match(
      /^\/github\/([^/]+)\/([^/]+)\/(stars|forks|issues|license)$/
    );

    if (githubBadgeRoute) {
      const [, owner, repo, metric] = githubBadgeRoute;

      return githubBadge(
        owner,
        repo,
        metric as "stars" | "forks" | "issues" | "license",
        url.searchParams
      );
    }

    // ═══════════════════════════════════════
    // API - Modrinth
    // /api/modrinth/project/downloads
    // ═══════════════════════════════════════

    const modrinthApi = path.match(
      /^\/api\/modrinth\/([^/]+)\/(downloads|followers|version)$/
    );

    if (modrinthApi) {
      const [, project, metric] = modrinthApi;

      return modrinthApiResponse(
        project,
        metric as "downloads" | "followers" | "version"
      );
    }

    // ═══════════════════════════════════════
    // Badge - Modrinth
    // /modrinth/project/downloads
    // ═══════════════════════════════════════

    const modrinthBadgeRoute = path.match(
      /^\/modrinth\/([^/]+)\/(downloads|followers|version)$/
    );

    if (modrinthBadgeRoute) {
      const [, project, metric] = modrinthBadgeRoute;

      return modrinthBadge(
        project,
        metric as "downloads" | "followers" | "version",
        url.searchParams
      );
    }

    // ═══════════════════════════════════════
    // API - npm
    // /api/npm/downloads/package
    // /api/npm/weekly-downloads/package
    // /api/npm/version/package
    // ═══════════════════════════════════════

    const npmApi = path.match(
      /^\/api\/npm\/(downloads|weekly-downloads|version)\/(.+)$/
    );

    if (npmApi) {
      const [, metric, packageName] = npmApi;

      return npmApiResponse(
        decodeURIComponent(packageName),
        metric as "downloads" | "weekly-downloads" | "version"
      );
    }

    // ═══════════════════════════════════════
    // Badge - npm
    // /npm/downloads/package
    // /npm/weekly-downloads/package
    // /npm/version/package
    // ═══════════════════════════════════════

    const npmBadgeRoute = path.match(
      /^\/npm\/(downloads|weekly-downloads|version)\/(.+)$/
    );

    if (npmBadgeRoute) {
      const [, metric, packageName] = npmBadgeRoute;

      return npmBadge(
        decodeURIComponent(packageName),
        metric as "downloads" | "weekly-downloads" | "version",
        url.searchParams
      );
    }

    // ═══════════════════════════════════════
    // API - Discord
    // ═══════════════════════════════════════

    const discordApi = path.match(
      /^\/api\/discord\/([^/]+)\/(members|online)$/
    );

    if (discordApi) {
      const [, target, metric] = discordApi;

      return json({
        target,
        metric,
        message: "unsupported",
      });
    }

    // ═══════════════════════════════════════
    // Badge - Discord
    // ═══════════════════════════════════════

    const discordBadgeRoute = path.match(
      /^\/discord\/([^/]+)\/(members|online)$/
    );

    if (discordBadgeRoute) {
      const [, target, metric] = discordBadgeRoute;

      return createBadgeResponse(
        metric,
        "unsupported",
        url.searchParams,
        501
      );
    }

    // ═══════════════════════════════════════
    // Static Badge
    // /static/label/message
    // ═══════════════════════════════════════

    const staticBadge = path.match(
      /^\/static\/([^/]+)\/([^/]+)$/
    );

    if (staticBadge) {
      const [, label, message] = staticBadge;

      return createBadgeResponse(
        decodeURIComponent(label),
        decodeURIComponent(message),
        url.searchParams
      );
    }

    // ═══════════════════════════════════════
    // Not Found
    // ═══════════════════════════════════════

    return new Response("Not Found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  },
};

// ═══════════════════════════════════════
// GitHub API
// ═══════════════════════════════════════

async function githubApiResponse(
  owner: string,
  repo: string,
  metric: "stars" | "forks" | "issues" | "license"
): Promise<Response> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(
        owner
      )}/${encodeURIComponent(repo)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "Laibo",
        },
      }
    );

    if (!response.ok) {
      return json(
        {
          error: "Repository not found",
          message: "not found",
        },
        response.status
      );
    }

    const data =
      (await response.json()) as GitHubRepository;

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
        value = data.license?.spdx_id || "none";
        break;
    }

    return json({
      provider: "github",
      target: `${owner}/${repo}`,
      metric,
      message: value,
    });
  } catch {
    return json(
      {
        error: "GitHub request failed",
        message: "error",
      },
      502
    );
  }
}

// ═══════════════════════════════════════
// GitHub Badge
// ═══════════════════════════════════════

async function githubBadge(
  owner: string,
  repo: string,
  metric: "stars" | "forks" | "issues" | "license",
  params: URLSearchParams
): Promise<Response> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(
        owner
      )}/${encodeURIComponent(repo)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "Laibo",
        },
      }
    );

    if (!response.ok) {
      return createBadgeResponse(
        params.get("label") || "github",
        "not found",
        params,
        response.status
      );
    }

    const data =
      (await response.json()) as GitHubRepository;

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
        value = data.license?.spdx_id || "none";
        break;
    }

    return createBadgeResponse(
      params.get("label") || metric,
      params.has("message")
        ? params.get("message") || value
        : value,
      params
    );
  } catch {
    return createBadgeResponse(
      params.get("label") || "github",
      "error",
      params,
      502
    );
  }
}

// ═══════════════════════════════════════
// Modrinth API
// ═══════════════════════════════════════

async function modrinthApiResponse(
  project: string,
  metric: "downloads" | "followers" | "version"
): Promise<Response> {
  try {
    const response = await fetch(
      `https://api.modrinth.com/v2/project/${encodeURIComponent(
        project
      )}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Laibo/0.1",
        },
      }
    );

    if (!response.ok) {
      return json(
        {
          error: "Project not found",
          message: "not found",
        },
        response.status
      );
    }

    const data =
      (await response.json()) as ModrinthProject;

    let value = "";

    switch (metric) {
      case "downloads":
        value = formatNumber(data.downloads);
        break;

      case "followers":
        value = formatNumber(data.followers);
        break;

      case "version":
        value =
          data.latest_version ||
          "unknown";
        break;
    }

    return json({
      provider: "modrinth",
      target: project,
      metric,
      message: value,
    });
  } catch {
    return json(
      {
        error: "Modrinth request failed",
        message: "error",
      },
      502
    );
  }
}

// ═══════════════════════════════════════
// Modrinth Badge
// ═══════════════════════════════════════

async function modrinthBadge(
  project: string,
  metric: "downloads" | "followers" | "version",
  params: URLSearchParams
): Promise<Response> {
  try {
    const response = await fetch(
      `https://api.modrinth.com/v2/project/${encodeURIComponent(
        project
      )}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Laibo/0.1",
        },
      }
    );

    if (!response.ok) {
      return createBadgeResponse(
        params.get("label") || "modrinth",
        "not found",
        params,
        response.status
      );
    }

    const data =
      (await response.json()) as ModrinthProject;

    let value = "";

    switch (metric) {
      case "downloads":
        value = formatNumber(data.downloads);
        break;

      case "followers":
        value = formatNumber(data.followers);
        break;

      case "version":
        value =
          data.latest_version ||
          "unknown";
        break;
    }

    return createBadgeResponse(
      params.get("label") || metric,
      params.has("message")
        ? params.get("message") || value
        : value,
      params
    );
  } catch {
    return createBadgeResponse(
      params.get("label") || "modrinth",
      "error",
      params,
      502
    );
  }
}

// ═══════════════════════════════════════
// npm API
// ═══════════════════════════════════════

async function npmApiResponse(
  packageName: string,
  metric:
    | "downloads"
    | "weekly-downloads"
    | "version"
): Promise<Response> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(
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
      return json(
        {
          error: "Package not found",
          message: "not found",
        },
        response.status
      );
    }

    const data =
      (await response.json()) as NpmPackage;

    let value = "";

    if (metric === "version") {
      value =
        data["dist-tags"]?.latest ||
        "unknown";
    } else {
      const downloads =
        await getNpmDownloads(packageName);

      value = formatNumber(downloads);
    }

    return json({
      provider: "npm",
      target: packageName,
      metric,
      message: value,
    });
  } catch {
    return json(
      {
        error: "npm request failed",
        message: "error",
      },
      502
    );
  }
}

// ═══════════════════════════════════════
// npm Badge
// ═══════════════════════════════════════

async function npmBadge(
  packageName: string,
  metric:
    | "downloads"
    | "weekly-downloads"
    | "version",
  params: URLSearchParams
): Promise<Response> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(
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
      return createBadgeResponse(
        params.get("label") || "npm",
        "not found",
        params,
        response.status
      );
    }

    const data =
      (await response.json()) as NpmPackage;

    let value = "";

    if (metric === "version") {
      value =
        data["dist-tags"]?.latest ||
        "unknown";
    } else {
      const downloads =
        await getNpmDownloads(packageName);

      value = formatNumber(downloads);
    }

    return createBadgeResponse(
      params.get("label") || metric,
      params.has("message")
        ? params.get("message") || value
        : value,
      params
    );
  } catch {
    return createBadgeResponse(
      params.get("label") || "npm",
      "error",
      params,
      502
    );
  }
}

// ═══════════════════════════════════════
// npm Downloads
// ═══════════════════════════════════════

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

  const data =
    (await response.json()) as {
      downloads?: number;
    };

  return data.downloads || 0;
}

// ═══════════════════════════════════════
// Badge Response
// ═══════════════════════════════════════

function createBadgeResponse(
  label: string,
  message: string,
  params: URLSearchParams,
  status = 200
): Response {
  const svg = createBadge(
    label,
    message,
    params
  );

  return new Response(svg, {
    status,
    headers: {
      "content-type":
        "image/svg+xml; charset=utf-8",

      "cache-control":
        status === 200
          ? "public, max-age=300, s-maxage=300"
          : "no-cache",

      "access-control-allow-origin": "*",
    },
  });
}

// ═══════════════════════════════════════
// Badge Renderer
// ═══════════════════════════════════════

function createBadge(
  label: string,
  message: string,
  params: URLSearchParams
): string {
  const allowedStyles: BadgeStyle[] = [
    "flat",
    "flat-square",
    "pill",
    "plastic",
    "for-the-badge",
    "social",
    "minimal",
    "outline",
    "soft",
    "gradient",
    "compact",
    "dot",
    "glass",
    "neon",
    "mono",
    "elevated",
    "inset",
    "transparent",
  ];

  const requestedStyle =
    params.get("style");

  const style: BadgeStyle =
    requestedStyle &&
    allowedStyles.includes(
      requestedStyle as BadgeStyle
    )
      ? (requestedStyle as BadgeStyle)
      : "flat";

  const height = clamp(
    Number(params.get("height") || 22),
    16,
    48
  );

  const radius = clamp(
    Number(params.get("radius") || 4),
    0,
    20
  );

  const fontSize = clamp(
    Number(params.get("fontSize") || 11),
    8,
    18
  );

  return renderBadge({
    label,
    message,
    style,

    labelColor: safeColor(
      params.get("labelColor"),
      "#475569"
    ),

    messageColor: safeColor(
      params.get("messageColor") ||
        params.get("color"),
      "#2563eb"
    ),

    textColor: safeColor(
      params.get("textColor"),
      "#ffffff"
    ),

    radius,
    height,
    fontSize,
  });
}

// ═══════════════════════════════════════
// Utilities
// ═══════════════════════════════════════

function formatNumber(
  value: number
): string {
  if (value >= 1_000_000_000) {
    return `${(
      value / 1_000_000_000
    )
      .toFixed(1)
      .replace(/\.0$/, "")}B`;
  }

  if (value >= 1_000_000) {
    return `${(
      value / 1_000_000
    )
      .toFixed(1)
      .replace(/\.0$/, "")}M`;
  }

  if (value >= 1_000) {
    return `${(
      value / 1_000
    )
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

  if (
    /^#[0-9a-fA-F]{3,8}$/.test(value)
  ) {
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

function json(
  data: unknown,
  status = 200
): Response {
  return new Response(
    JSON.stringify(data, null, 2),
    {
      status,
      headers: {
        "content-type":
          "application/json; charset=utf-8",

        "access-control-allow-origin":
          "*",

        "cache-control":
          status === 200
            ? "public, max-age=60, s-maxage=60"
            : "no-cache",
      },
    }
  );
}