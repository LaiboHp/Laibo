# Laibo

Laibo is a badge infrastructure app for generating dynamic and static project badges for Git repositories, packages, Discord communities, and more.

The project ships as a small Vite + React + TypeScript front end and is designed to generate shareable badge URLs and preview SVGs for modern developer workflows.

## Overview

Laibo helps developers create badges like:

- GitHub repository metrics
- NPM package stats
- Modrinth project stats
- Discord server stats
- Static custom badges

The interface includes a live badge preview, styling controls, and copyable badge/Markdown output.

## Tech stack

- React 19
- TypeScript
- Vite
- Cloudflare Workers / Wrangler for deployment
- SVG badge rendering

## Repository structure

```text
.
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.jsonc
├── src/
│   ├── App.tsx
│   ├── index.ts
│   ├── main.tsx
│   ├── providers.ts
��   ├── style.css
│   └── badges/
└── README.md
```

## Getting started

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Deploy:

```bash
npm run deploy
```

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run deploy` — build and deploy with Wrangler
- `npm run types` — generate Wrangler TypeScript declarations

## Language composition

This repository is primarily authored in TypeScript, with supporting frontend styling in CSS and static HTML structure. The app also includes configuration and lock files for the JavaScript ecosystem.

## License

This project does not currently declare a license in the repository metadata.

## Project status

Laibo is a lightweight badge generator and UI prototype focused on fast badge creation and customization for developer-facing services.
