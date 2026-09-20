# Ivar Hinisan Portfolio

A static React and TypeScript portfolio. The application lives in [`webPortfolio/`](webPortfolio/README.md), reads its content from a bundled JSON file, and requires no database or environment variables.

## Local Development

From the repository root:

```sh
npm --prefix webPortfolio install
npm --prefix webPortfolio run dev
```

Open `http://localhost:5173`.

## Build

```sh
npm --prefix webPortfolio run lint
npm --prefix webPortfolio run build
```

Deploy the generated `webPortfolio/dist` directory to any static hosting provider.
