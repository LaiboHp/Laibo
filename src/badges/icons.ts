import type { Provider } from "./types";

import github from "./icons/github.svg?raw";
import npm from "./icons/npm.svg?raw";
import modrinth from "./icons/modrinth.svg?raw";
import discord from "./icons/discord.svg?raw";
import gitlab from "./icons/gitlab.svg?raw";
import gitea from "./icons/gitea.svg?raw";
import forgejo from "./icons/forgejo.svg?raw";
import bitbucket from "./icons/bitbucket.svg?raw";
import docker from "./icons/docker.svg?raw";
import pypi from "./icons/pypi.svg?raw";

const icons: Partial<Record<Provider, string>> = {
  github,
  npm,
  modrinth,
  discord,
  gitlab,
  gitea,
  forgejo,
  bitbucket,
  docker,
  pypi,
};

export function getProviderIcon(
  provider: Provider,
  size = 14,
): string {
  const source = icons[provider];

  if (!source) {
    return "";
  }

  const viewBox =
    source.match(/viewBox=["']([^"']+)["']/i)?.[1] ??
    "0 0 24 24";

  const body = source
    .replace(/<svg[\s\S]*?>/i, "")
    .replace(/<\/svg>/i, "")
    .replace(/fill=["'][^"']*["']/gi, "")
    .replace(/width=["'][^"']*["']/gi, "")
    .replace(/height=["'][^"']*["']/gi, "")
    .replace(/style=["'][^"']*["']/gi, "");

  const [minX, minY, viewWidth, viewHeight] =
    viewBox.split(/\s+/).map(Number);

  const scale = size / Math.max(viewWidth, viewHeight);

  const offsetX =
    3 + (size - viewWidth * scale) / 2 - minX * scale;

  const offsetY =
    (24 - viewHeight * scale) / 2 - minY * scale;

  return `
    <g
      transform="translate(${offsetX} ${offsetY}) scale(${scale})"
      fill="#ffffff"
      aria-hidden="true"
    >
      ${body}
    </g>
  `;
}