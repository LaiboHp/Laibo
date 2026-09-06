import { useEffect, useMemo, useState } from "react";
import type { BadgeStyle, Provider } from "./badges/types";
import { renderBadge } from "./badges/renderer";
import { badgeStyles } from "./badges/styles";
import { providers } from "./providers";

const initialProvider: Provider = "github";

export default function App() {
  const [provider, setProvider] = useState<Provider>(initialProvider);
  const [target, setTarget] = useState("LaiboHp/Laibo");
  const [metric, setMetric] = useState("stars");

  const [label, setLabel] = useState("stars");
  const [message, setMessage] = useState("1.2k");
  const [customMessage, setCustomMessage] = useState(false);

  const [style, setStyle] = useState<BadgeStyle>("flat");
  const [labelColor, setLabelColor] = useState("#475569");
  const [messageColor, setMessageColor] = useState("#2563eb");
  const [textColor, setTextColor] = useState("#ffffff");

  const [height, setHeight] = useState(22);
  const [radius, setRadius] = useState(4);
  const [fontSize, setFontSize] = useState(11);

  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("laibo-theme") || "light"
  );

  const currentProvider = providers.find((p) => p.id === provider)!;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("laibo-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (provider === "static" || customMessage) return;

    const controller = new AbortController();

    async function loadValue() {
      setLoading(true);

      try {
        let path = "";

        if (provider === "github") {
          const parts = target.split("/");

          if (parts.length !== 2) {
            setMessage("invalid");
            return;
          }

          path = `/api/github/${encodeURIComponent(parts[0])}/${encodeURIComponent(
            parts[1]
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
          signal: controller.signal
        });

        const data = await response.json();

        setMessage(String(data.message ?? "error"));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setMessage("error");
        }
      } finally {
        setLoading(false);
      }
    }

    loadValue();

    return () => controller.abort();
  }, [provider, target, metric, customMessage]);

  const previewSvg = useMemo(
    () =>
      renderBadge({
        label,
        message,
        style,
        labelColor,
        messageColor,
        textColor,
        radius,
        height,
        fontSize
      }),
    [
      label,
      message,
      style,
      labelColor,
      messageColor,
      textColor,
      radius,
      height,
      fontSize
    ]
  );

  const previewUrl = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(previewSvg)}`,
    [previewSvg]
  );

  const badgeUrl = useMemo(() => {
    if (provider === "static") {
      return `/static/${encodeURIComponent(label)}/${encodeURIComponent(
        message
      )}`;
    }

    let path = "";

    if (provider === "github") {
      const [owner, repo] = target.split("/");
      path = `/github/${encodeURIComponent(owner || "")}/${encodeURIComponent(
        repo || ""
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
      labelColor,
      messageColor,
      textColor,
      radius: String(radius),
      height: String(height),
      fontSize: String(fontSize)
    });

    if (customMessage) {
      params.set("message", message);
    }

    return path + "?" + params.toString();
  }, [
    provider,
    target,
    metric,
    label,
    message,
    customMessage,
    style,
    labelColor,
    messageColor,
    textColor,
    radius,
    height,
    fontSize
  ]);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
  }

  function selectProvider(next: Provider) {
    setProvider(next);

    const nextProvider = providers.find((p) => p.id === next);

    if (nextProvider) {
      setMetric(nextProvider.metrics[0].id);

      if (next === "static") {
        setLabel("build");
        setMessage("passing");
        setCustomMessage(true);
      } else {
        setCustomMessage(false);
      }
    }
  }

  return (
    <div className="app">
      <header className="nav">
        <div className="brand">
          <span className="brand-mark">L</span>
          <span>Laibo</span>
        </div>

        <nav>
          <a href="#builder">Builder</a>
          <a href="#templates">Templates</a>
          <a href="#providers">Providers</a>
          <a href="#docs">Docs</a>
        </nav>

        <button
          className="theme-button"
          onClick={() =>
            setTheme((value) => (value === "light" ? "dark" : "light"))
          }
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </header>

      <main>
        <section className="intro">
          <div>
            <span className="eyebrow">BADGE INFRASTRUCTURE</span>
            <h1>Build badges your way.</h1>
            <p>
              Dynamic and static badges for Git repositories, packages,
              Minecraft projects, Discord servers and more.
            </p>
          </div>
        </section>

        <section className="builder" id="builder">
          <div className="panel controls">
            <div className="section-heading">
              <div>
                <span className="eyebrow">SOURCE</span>
                <h2>Choose a provider</h2>
              </div>
            </div>

            <div className="provider-grid">
              {providers.map((item) => (
                <button
                  key={item.id}
                  className={`provider ${
                    provider === item.id ? "selected" : ""
                  }`}
                  onClick={() => selectProvider(item.id)}
                >
                  <strong>{item.name}</strong>
                  <span>
                    {item.id === "static" ? "No API" : item.description}
                  </span>
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
                  onChange={(event) => setTarget(event.target.value)}
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
                  onChange={(event) => setMetric(event.target.value)}
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
                  onChange={(event) => setLabel(event.target.value)}
                />
              </label>

              <label className={customMessage ? "" : "muted-field"}>
                <span>Message</span>

                <input
                  value={message}
                  disabled={!customMessage}
                  onChange={(event) => setMessage(event.target.value)}
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
                <span>Use custom message</span>
              </label>
            </div>

            <div className="subheading">
              <span className="eyebrow">STYLE</span>
              <h3>Appearance</h3>
            </div>

            <div className="style-grid">
              {badgeStyles.map((item) => (
                <button
                  key={item.id}
                  className={`style-card ${
                    style === item.id ? "selected" : ""
                  }`}
                  onClick={() => setStyle(item.id)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
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

          <aside className="panel preview-panel">
            <div className="preview-header">
              <div>
                <span className="eyebrow">LIVE PREVIEW</span>
                <h2>{loading ? "Updating..." : "Your badge"}</h2>
              </div>

              <span className="status-dot" />
            </div>

            <div className="preview-stage">
              <img src={previewUrl} alt="Badge preview" />
            </div>

            <div className="output">
              <span>Badge URL</span>

              <code>{badgeUrl}</code>

              <div className="actions">
                <button onClick={() => copy(badgeUrl)}>
                  Copy URL
                </button>

                <button
                  onClick={() =>
                    copy(
                      `![${label}: ${message}](${location.origin}${badgeUrl})`
                    )
                  }
                >
                  Copy Markdown
                </button>
              </div>
            </div>

            <div className="output">
              <span>SVG</span>

              <code>{previewSvg.slice(0, 140)}...</code>

              <button onClick={() => copy(previewSvg)}>
                Copy SVG
              </button>
            </div>
          </aside>
        </section>

        <section id="templates" className="content-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TEMPLATES</span>
              <h2>More styles. Same API.</h2>
            </div>
            <p>
              Pick a visual language and customize it without changing your
              badge endpoint.
            </p>
          </div>

          <div className="template-strip">
            {badgeStyles.slice(0, 10).map((item) => (
              <button
                key={item.id}
                className="template-preview"
                onClick={() => setStyle(item.id)}
              >
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                    renderBadge({
                      label: item.name,
                      message: "1.2k",
                      style: item.id,
                      labelColor,
                      messageColor,
                      textColor,
                      radius,
                      height,
                      fontSize
                    })
                  )}`}
                  alt={item.name}
                />
                <strong>{item.name}</strong>
              </button>
            ))}
          </div>
        </section>

        <section id="providers" className="content-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ECOSYSTEM</span>
              <h2>Built for more than GitHub.</h2>
            </div>
          </div>

          <div className="provider-list">
            {providers.map((item) => (
              <div className="provider-row" key={item.id}>
                <strong>{item.name}</strong>
                <span>{item.description}</span>
                <small>
                  {item.id === "static" ? "READY" : "SUPPORTED"}
                </small>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="docs">
        <strong>Laibo</strong>
        <span>Fast badge infrastructure for developers.</span>
      </footer>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label} color</span>

      <div className="color-input">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(event) => onChange(event.target.value)}
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
  onChange
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
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
