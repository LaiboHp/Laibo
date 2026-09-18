import { SITE_NAME, SITE_URL } from "./seo";

export function addStructuredData() {
  const id = "laibo-structured-data";

  document.getElementById(id)?.remove();

  const script = document.createElement("script");

  script.id = id;
  script.type = "application/ld+json";

  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description:
          "Fast, simple, and open badge infrastructure for modern projects.",
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#application`,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description:
          "Create customizable badges for GitHub, Modrinth, npm, Discord, and modern open-source projects.",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  });

  document.head.appendChild(script);
}