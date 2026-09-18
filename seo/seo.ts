export const SITE_URL = "https://laibo.www0abdb.workers.dev";
export const SITE_NAME = "Laibo";

export type SEOConfig = {
  title: string;
  description: string;
  path: string;
};

export function applySEO({
  title,
  description,
  path,
}: SEOConfig) {
  const url = new URL(path, SITE_URL).toString();

  document.title = title;

  setMeta("description", description);
  setMeta("robots", "index, follow");

  setMetaProperty("og:type", "website");
  setMetaProperty("og:site_name", SITE_NAME);
  setMetaProperty("og:title", title);
  setMetaProperty("og:description", description);
  setMetaProperty("og:url", url);

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", title);
  setMeta("twitter:description", description);

  let canonical =
    document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = url;
}

function setMeta(name: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  element.content = content;
}

function setMetaProperty(property: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  element.content = content;
}