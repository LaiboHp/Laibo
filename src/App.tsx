import { useEffect, useMemo, useState } from "react";
import type { BadgeStyle, Provider } from "./badges/types";
import { renderBadge } from "./badges/renderer";
import { badgeStyles } from "./badges/styles";
import { badgeTemplates } from "./badges/templates";
import { providers } from "./providers";

const initialProvider: Provider = "github";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem("laibo-theme");

  return stored === "dark" ? "dark" : "light";
}

export default function App() {
  const [provider, setProvider] = useState<Provider>(initialProvider);
  const [target, setTarget] = useState("LaiboHp/Laibo");
  const [metric, setMetric] = useState("stars");

  const [label, setLabel] = useState("stars");
  const [message, setMessage] = useState("1.2k");
  const [customMessage, setCustomMessage] = useState(false);

  const [style, setStyle] = useState<BadgeStyle>("flat");
  const [template, setTemplate] = useState("classic");

  const [labelColor, setLabelColor] = useState("#475569");
  const [messageColor, setMessageColor] = useState("#2563eb");
  const [textColor, setTextColor] = useState("#ffffff");

  const [height, setHeight] = useState(22);
  const [radius, setRadius] = useState(4);
  const [fontSize, setFontSize] = useState(11);

  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  const currentProvider = providers.find((item) => item.id === provider)!;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    if (typeof window !== "undefined") {
      window.localStorage.setItem("laibo-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (provider === "static" || customMessage) return;

    const controller = new AbortController();

    async function loadValue() {
      setLoading(true);

      try {
        let path = "";

        if (provider === "github") {
          const [owner, repo] = target.split("/");

          if (!owner || !repo) {
            setMessage("invalid");
            return;
          }

          path = `/api/github/${encodeURIComponent(owner)}/${encodeURIComponent(
            repo,
          )}/${metric}`;
        } else if (provider === "npm") {
          path = `/api/npm/${metric}/${encodeURIComponent(target)}`;
        } else if (provider === "modrinth") {
          path = `/api/modrinth/${encodeURIComponent(target)}/${metric}`;
        } else if (provider === "discord") {
          path = `/api/discord/${encodeURIComponent(target)}/${metric}`;
        } else {
          setMessage("soon");
          return;
        }

        const response = await fetch(path, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();

        setMessage(String(data.message ?? "error"));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setMessage("error");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const timeout = setTimeout(loadValue, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [provider, target, metric, customMessage]);

  const badgeUrl = useMemo(() => {
    let path = "";

    if (provider === "static") {
      path = `/static/${encodeURIComponent(label)}/${encodeURIComponent(
        message,
      )}`;
    } else if (provider === "github") {
      const [owner, repo] = target.split("/");

      if (!owner || !repo) {
        return "";
      }

      path = `/github/${encodeURIComponent(owner)}/${encodeURIComponent(
        repo,
      )}/${metric}`;
    } else if (provider === "npm") {
      path = `/npm/${metric}/${encodeURIComponent(target)}`;
    } else if (provider === "modrinth") {
      path = `/modrinth/${encodeURIComponent(target)}/${metric}`;
    } else if (provider === "discord") {
      path = `/discord/${encodeURIComponent(target)}/${metric}`;
    } else {
      path = `/${provider}/${metric}/${encodeURIComponent(target)}`;
    }

    const params = new URLSearchParams({
      label,
      style,
      template,
      labelColor,
      messageColor,
      textColor,
      radius: String(radius),
      height: String(height),
      fontSize: String(fontSize),
    });

    if (customMessage) {
      params.set("message", message);
    }

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";

    return `${origin}${path}?${params.toString()}`;
  }, [
    provider,
    target,
    metric,
    label,
    message,
    customMessage,
    style,
    template,
    labelColor,
    messageColor,
    textColor,
    radius,
    height,
    fontSize,
  ]);

  async function copy(value: string) {
    if (!value) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return;
      }

      const textarea = document.createElement("textarea");

      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);

      textarea.select();
      document.execCommand("copy");

      document.body.removeChild(textarea);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function selectProvider(next: Provider) {
    setProvider(next);

    const nextProvider = providers.find((item) => item.id === next);

    if (!nextProvider || nextProvider.metrics.length === 0) {
      return;
    }

    setMetric(nextProvider.metrics[0].id);

    if (next === "static") {
      setLabel("build");
      setMessage("passing");
      setCustomMessage(true);
    } else {
      setCustomMessage(false);
    }
  }

  function applyTemplate(templateId: string) {
    const selected = badgeTemplates.find(
      (item) => item.id === templateId,
    );

    if (!selected) return;

    setTemplate(templateId);
    setStyle(selected.options.style);
    setLabelColor(selected.options.labelColor);
    setMessageColor(selected.options.messageColor);
    setTextColor(selected.options.textColor);
    setRadius(selected.options.radius);
    setHeight(selected.options.height);
    setFontSize(selected.options.fontSize);
  }

  return (
    <div className="app">
      <header className="nav">
        <a className="brand" href="/">
          <span className="brand-mark">L</span>
          <span>Laibo</span>
        </a>

        <nav>
          <a href="#builder">Builder</a>
          <a href="#templates">Templates</a>
          <a href="#styles">Styles</a>
          <a href="#providers">Providers</a>
        </nav>

        <button
          className="theme-button"
          onClick={() =>
            setTheme((value) =>
              value === "light" ? "dark" : "light",
            )
          }
          aria-label="Toggle theme"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </header>

      <main>
        <section className="builder" id="builder">
          <div className="controls">
            <div className="title">
              <h1>Badge builder</h1>
              <p>Create a badge and copy its URL.</p>
            </div>

            <div className="provider-tabs">
              {providers.map((item) => (
                <button
                  key={item.id}
                  className={
                    provider === item.id ? "selected" : ""
                  }
                  onClick={() => selectProvider(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="fields">
              <label>
                <span>
                  {provider === "github"
                    ? "Repository"
                    : provider === "discord"
                      ? "Server ID"
                      : provider === "static"
                        ? "Badge"
                        : "Project / Package"}
                </span>

                <input
                  value={target}
                  onChange={(event) =>
                    setTarget(event.target.value)
                  }
                  placeholder={
                    provider === "github"
                      ? "owner/repository"
                      : provider === "discord"
                        ? "123456789"
                        : "project"
                  }
                />
              </label>

              <label>
                <span>Metric</span>

                <select
                  value={metric}
                  onChange={(event) =>
                    setMetric(event.target.value)
                  }
                >
                  {currentProvider.metrics.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Label</span>

                <input
                  value={label}
                  onChange={(event) =>
                    setLabel(event.target.value)
                  }
                />
              </label>

              <label>
                <span>Message</span>

                <input
                  value={message}
                  disabled={!customMessage}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                />
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={customMessage}
                  onChange={(event) =>
                    setCustomMessage(event.target.checked)
                  }
                />

                <span>Custom message</span>
              </label>
            </div>

            <div className="options">
              <div>
                <h2>Style</h2>

                <div className="style-list">
                  {badgeStyles.map((item) => (
                    <button
                      key={item.id}
                      className={
                        style === item.id ? "selected" : ""
                      }
                      onClick={() => {
                        setTemplate("custom");
                        setStyle(item.id);
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="color-grid">
                <ColorInput
                  label="Label"
                  value={labelColor}
                  onChange={setLabelColor}
                />

                <ColorInput
                  label="Message"
                  value={messageColor}
                  onChange={setMessageColor}
                />

                <ColorInput
                  label="Text"
                  value={textColor}
                  onChange={setTextColor}
                />
              </div>

              <div className="range-grid">
                <Range
                  label="Height"
                  value={height}
                  min={16}
                  max={48}
                  onChange={setHeight}
                />

                <Range
                  label="Radius"
                  value={radius}
                  min={0}
                  max={20}
                  onChange={setRadius}
                />

                <Range
                  label="Font"
                  value={fontSize}
                  min={8}
                  max={18}
                  onChange={setFontSize}
                />
              </div>
            </div>
          </div>

          <aside className="preview">
            <div className="preview-top">
              <h2>{loading ? "Updating..." : "Preview"}</h2>
              <span className="status-dot" />
            </div>

            <div className="preview-stage">
              <div className="preview-badge">
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                    renderBadge({
                      label,
                      message,
                      style,
                      template:
                        template === "custom"
                          ? undefined
                          : (template as
                              | "classic"
                              | "github"
                              | "npm"
                              | "modrinth"
                              | "discord"
                              | "build"
                              | "downloads"
                              | "version"
                              | "license"
                              | "coverage"
                              | "release"
                              | "opensource"
                              | "documentation"
                              | "website"
                              | "security"),
                      labelColor,
                      messageColor,
                      textColor,
                      radius,
                      height,
                      fontSize,
                    }),
                  )}`}
                  alt="Badge preview"
                  draggable={false}
                />
              </div>
            </div>

            <div className="output">
              <span>URL</span>
              <code>{badgeUrl || "—"}</code>

              <div className="actions">
                <button
                  onClick={() => copy(badgeUrl)}
                  disabled={!badgeUrl}
                >
                  Copy URL
                </button>

                <button
                  onClick={() =>
                    copy(
                      `![${label}: ${message}](${badgeUrl})`,
                    )
                  }
                  disabled={!badgeUrl}
                >
                  Copy Markdown
                </button>
              </div>
            </div>

            <div className="output">
              <span>SVG</span>
              <code>SVG badge generated by Laibo</code>

              <button
                disabled={!badgeUrl}
                onClick={async () => {
                  if (!badgeUrl) return;

                  try {
                    const response = await fetch(badgeUrl);
                    const svg = await response.text();

                    await copy(svg);
                  } catch (error) {
                    console.error(
                      "Failed to copy SVG:",
                      error,
                    );
                  }
                }}
              >
                Copy SVG
              </button>
            </div>
          </aside>
        </section>

        <section id="templates" className="section">
          <h2>Templates</h2>
          <p>Start from a ready-made badge design.</p>

          <div className="template-list">
            {badgeTemplates.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`template-preview ${
                  template === item.id ? "active" : ""
                }`}
                onClick={() => applyTemplate(item.id)}
              >
                <div className="template-badge">
                  <img
                    src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                      renderBadge({
                        label,
                        message,
                        ...item.options,
                      }),
                    )}`}
                    alt={`${item.name} badge template`}
                    draggable={false}
                  />
                </div>

                <span>{item.name}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section id="styles" className="section">
          <h2>Styles</h2>
          <p>Choose a rendering style for your badge.</p>

          <div className="template-list">
            {badgeStyles.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`template-preview ${
                  template === "custom" &&
                  style === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setTemplate("custom");
                  setStyle(item.id);
                }}
              >
                <div className="template-badge">
                  <img
                    src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                      renderBadge({
                        label,
                        message,
                        style: item.id,
                        labelColor,
                        messageColor,
                        textColor,
                        radius,
                        height,
                        fontSize,
                      }),
                    )}`}
                    alt={`${item.name} badge style`}
                    draggable={false}
                  />
                </div>

                <span>{item.name}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section id="providers" className="section">
          <h2>Providers</h2>
          <p>Sources currently supported by Laibo.</p>

          <div className="provider-list">
            {providers.map((item) => (
              <div className="provider-row" key={item.id}>
                <strong>{item.name}</strong>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <strong>Laibo</strong>
        <span>Badge infrastructure for developers.</span>
      </footer>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>

      <div className="color-input">
        <input
          type="color"
          value={
            /^#[0-9a-fA-F]{6}$/.test(value)
              ? value
              : "#000000"
          }
          onChange={(event) =>
            onChange(event.target.value)
          }
        />

        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
      </div>
    </label>
  );
}

function Range({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span>
        {label} <b>{value}</b>
      </span>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
      />
    </label>
  );
}