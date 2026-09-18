
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { applySEO } from "../seo/seo";
import { addStructuredData } from "../seo/structuredData";
import { providers } from "../providers";

const seoData = {
  github: {
    title: "GitHub Badges — Laibo",
    description:
      "Create fast and customizable GitHub repository badges with Laibo. Display stars, forks, issues, and other repository metrics.",
    heading: "GitHub Badges"
  },

  modrinth: {
    title: "Modrinth Badges — Laibo",
    description:
      "Create customizable Modrinth project badges with Laibo. Display downloads, followers, and project information.",
    heading: "Modrinth Badges"
  },

  npm: {
    title: "npm Badges — Laibo",
    description:
      "Create fast npm package badges with Laibo. Display package downloads and other npm package metrics.",
    heading: "npm Badges"
  },

  discord: {
    title: "Discord Badges — Laibo",
    description:
      "Create Discord server badges with Laibo and display server information directly in your README.",
    heading: "Discord Badges"
  },

  static: {
    title: "Static Badges — Laibo",
    description:
      "Create simple customizable static badges with Laibo for documentation, repositories, and open-source projects.",
    heading: "Static Badges"
  }
} as const;

type ProviderId = keyof typeof seoData;

export default function ProviderPage() {
  const { provider } = useParams();

  const id = provider as ProviderId;
  const data = seoData[id];

  useEffect(() => {
    if (!data) return;

    applySEO({
      title: data.title,
      description: data.description,
      path: `/providers/${id}`
    });

    addStructuredData();
  }, [id, data]);

  if (!data) {
    return (
      <main className="section">
        <h1>Provider not found</h1>
        <Link to="/">Back to Laibo</Link>
      </main>
    );
  }

  const providerInfo = providers.find((item) => item.id === id);

  return (
    <main className="seo-page">
      <nav className="nav">
        <Link className="brand" to="/">
          <span className="brand-mark">L</span>
          <span>Laibo</span>
        </Link>

        <Link to="/">Badge Builder</Link>
      </nav>

      <article className="section seo-content">
        <p className="eyebrow">Laibo Badges</p>

        <h1>{data.heading}</h1>

        <p className="lead">{data.description}</p>

        {providerInfo && (
          <section>
            <h2>About {providerInfo.name} badges</h2>

            <p>{providerInfo.description}</p>

            <p>
              Laibo generates lightweight SVG badges that can be used in
              README files, documentation, project websites, and other
              developer tools.
            </p>
          </section>
        )}

        <section>
          <h2>How to use it</h2>

          <ol>
            <li>Open the Laibo badge builder.</li>
            <li>Select {data.heading.replace(" Badges", "")}.</li>
            <li>Choose a metric and customize the badge.</li>
            <li>Copy the generated Markdown or badge URL.</li>
            <li>Paste it into your README or documentation.</li>
          </ol>
        </section>

        <section>
          <h2>Customize your badge</h2>

          <p>
            Laibo supports different badge styles, colors, sizes, radius,
            labels, messages, and text settings.
          </p>
        </section>

        <section>
          <h2>Explore Laibo</h2>

          <div className="provider-list">
            <Link to="/providers/github">GitHub Badges</Link>
            <Link to="/providers/modrinth">Modrinth Badges</Link>
            <Link to="/providers/npm">npm Badges</Link>
            <Link to="/providers/discord">Discord Badges</Link>
            <Link to="/providers/static">Static Badges</Link>
          </div>
        </section>

        <Link to="/" className="primary-link">
          Open Badge Builder
        </Link>
      </article>
    </main>
  );
}
