import type { ProviderDefinition } from "./badges/types";

export const providers: ProviderDefinition[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Repositories and development metrics",
    metrics: [
      { id: "stars", name: "Stars" },
      { id: "forks", name: "Forks" },
      { id: "issues", name: "Issues" },
      { id: "license", name: "License" },
      { id: "watchers", name: "Watchers" },
      { id: "size", name: "Repository size" }
    ]
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "GitLab project metrics",
    metrics: [
      { id: "stars", name: "Stars" },
      { id: "forks", name: "Forks" },
      { id: "issues", name: "Issues" }
    ]
  },
  {
    id: "gitea",
    name: "Gitea",
    description: "Open-source Git hosting",
    metrics: [
      { id: "stars", name: "Stars" },
      { id: "forks", name: "Forks" },
      { id: "issues", name: "Issues" }
    ]
  },
  {
    id: "forgejo",
    name: "Forgejo",
    description: "Community-driven Git hosting",
    metrics: [
      { id: "stars", name: "Stars" },
      { id: "forks", name: "Forks" },
      { id: "issues", name: "Issues" }
    ]
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    description: "Bitbucket repositories",
    metrics: [
      { id: "stars", name: "Stars" },
      { id: "forks", name: "Forks" },
      { id: "issues", name: "Issues" }
    ]
  },
  {
    id: "npm",
    name: "npm",
    description: "JavaScript package metrics",
    metrics: [
      { id: "version", name: "Version" },
      { id: "downloads", name: "Downloads" }
    ]
  },
  {
    id: "modrinth",
    name: "Modrinth",
    description: "Minecraft project metrics",
    metrics: [
      { id: "downloads", name: "Downloads" },
      { id: "followers", name: "Followers" },
      { id: "version", name: "Latest version" }
    ]
  },
  {
    id: "docker",
    name: "Docker Hub",
    description: "Container statistics",
    metrics: [
      { id: "pulls", name: "Pulls" },
      { id: "stars", name: "Stars" },
      { id: "tags", name: "Tags" }
    ]
  },
  {
    id: "pypi",
    name: "PyPI",
    description: "Python package metrics",
    metrics: [
      { id: "version", name: "Version" },
      { id: "downloads", name: "Downloads" }
    ]
  },
  {
    id: "crates",
    name: "crates.io",
    description: "Rust package metrics",
    metrics: [
      { id: "version", name: "Version" },
      { id: "downloads", name: "Downloads" }
    ]
  },
  {
    id: "discord",
    name: "Discord",
    description: "Public Discord server metrics",
    metrics: [
      { id: "members", name: "Members" },
      { id: "online", name: "Online" },
      { id: "name", name: "Server name" }
    ]
  },
  {
    id: "static",
    name: "Static",
    description: "Create non-dynamic badges",
    metrics: [
      { id: "custom", name: "Custom" }
    ]
  }
];
