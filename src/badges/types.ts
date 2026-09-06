export type Provider =
  | "github"
  | "gitlab"
  | "gitea"
  | "forgejo"
  | "bitbucket"
  | "npm"
  | "modrinth"
  | "docker"
  | "pypi"
  | "crates"
  | "discord"
  | "static";

export type BadgeStyle =
  | "flat"
  | "flat-square"
  | "pill"
  | "plastic"
  | "for-the-badge"
  | "social"
  | "minimal"
  | "outline"
  | "soft"
  | "gradient"
  | "compact"
  | "dot"
  | "glass"
  | "neon"
  | "mono"
  | "elevated"
  | "inset"
  | "transparent";

export interface BadgeOptions {
  label: string;
  message: string;
  style: BadgeStyle;
  labelColor: string;
  messageColor: string;
  textColor: string;
  radius: number;
  height: number;
  fontSize: number;
}

export interface ProviderMetric {
  id: string;
  name: string;
}

export interface ProviderDefinition {
  id: Provider;
  name: string;
  description: string;
  metrics: ProviderMetric[];
}
