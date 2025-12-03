# Mio SDK documentation

This directory hosts the public documentation for `@mio/sdk`. Pages are written in MDX, rendered with Mintlify, and grouped under `Guides` and `API reference` tabs.

## Prerequisites

- Node.js 18+
- [Mintlify CLI](https://www.npmjs.com/package/mint): `npm i -g mint`

## Local development

```bash
cd docs
mint dev
```

- Preview is available at `http://localhost:3000`.
- The server reloads automatically when you edit any file inside `docs/`.

## Recommended workflow

1. Create a feature branch (e.g., `git checkout -b docs/new-guide`).
2. Edit MDX pages, snippets, or `docs.json` (navigation + theme).
3. Run `mint broken-links` before opening a PR to validate internal links.
4. Commit with clear messages and let CI deploy via the Mintlify GitHub app.

## Structure

| Path | Purpose |
| --- | --- |
| `docs/index.mdx` | Landing page / overview |
| `docs/quickstart.mdx` | Step-by-step integration guide |
| `docs/guides/*` | Architecture, frontend, backend, and React + LLM guides |
| `docs/api-reference/*` | Method-level reference for client, server, React, and types |
| `docs/snippets/*` | Reusable content embedded via `<Snippet src="..." />` |
| `docs/docs.json` | Site metadata, navigation, branding |
| `docs/.cursor/rules.md` | Authoring standards enforced by Cursor |

## Writing standards

- Follow `docs/CLAUDE.md` and `docs/.cursor/rules.md` for tone, structure, and component usage.
- Always include YAML frontmatter (`title`, `description`).
- Use `Steps`, `Tabs`, `Callouts`, `ParamField`, and `ResponseField` where appropriate.
- Keep examples runnable. Test code (especially API requests) before committing.

## Useful scripts

```bash
# from the repository root
npm install        # installs SDK dependencies
npm run build      # builds the SDK package
```

Formatting and linting are handled by your editor + Prettier. MDX files follow the conventions enforced by Mintlify.
