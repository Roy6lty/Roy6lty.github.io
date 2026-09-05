# Portfolio Style Guide

This document is the working reference for extending the static portfolio without losing its visual language, accessibility, or public-safe content boundary.

## Direction

The site uses a systems editorial aesthetic: an off-white grid, dark instrument panels, strong typography, and small technical labels. New sections should feel considered and direct rather than decorative for its own sake.

Keep the focus on backend engineering, AI integration, cloud infrastructure, and useful product work.

## Design Tokens

The source of truth for tokens is `styles.css` under `:root`.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#101515` | Primary text and dark surfaces |
| `--ink-soft` | `#56615d` | Supporting text |
| `--paper` | `#edf0e8` | Page background |
| `--paper-deep` | `#dfe5dc` | Secondary backgrounds |
| `--white` | `#f9fbf4` | Cards and light text |
| `--lime` | `#d9ff55` | Primary accent and active states |
| `--orange` | `#ff795d` | Actions and labels |
| `--blue` | `#a9c8ff` | Network database tier |
| `--line` | `rgba(16, 21, 21, .16)` | Borders and dividers |

Do not introduce one-off colors unless a new visual system genuinely needs one. Prefer existing tokens and CSS variables.

## Typography

- `Space Grotesk` is used for headings and display text.
- `Manrope` is used for body copy and interface text.
- `DM Mono` is used for labels, metadata, tags, and technical details.
- Headings use tight letter spacing and short line lengths.
- Body copy should stay readable, specific, and reasonably concise.
- Use sentence case for descriptions and uppercase styling only for labels.

## Layout

- The main frame is capped at `1240px` and uses a responsive side gutter.
- Desktop sections use generous vertical spacing and CSS Grid.
- The primary responsive breakpoint is `800px`.
- The narrow mobile breakpoint is `430px`.
- At mobile widths, multi-column layouts should collapse to one column rather than squeeze content.
- Preserve the existing `section-pad`, `project-grid`, `button`, `text-link`, and card patterns before adding new utilities.

## Components

### Header

Use the shared header structure and page body class. Set the current page with `class="active"` and `aria-current="page"`. Keep the mobile menu button labelled and connected with `aria-controls`.

### Buttons and links

- Use `.button-primary` for the main action.
- Use `.button-secondary` for a quieter action.
- Use `.text-link` for inline or secondary navigation.
- External links should use `target="_blank" rel="noreferrer"`.
- Link text should describe the destination or action.

### Project cards

Keep project cards consistent across `index.html` and `projects.html`:

- Include a useful image `alt` value.
- Keep the project category and number visible.
- Lead with the actual responsibility, not vague praise.
- Use technology tags only when the project source supports them.
- Keep product links public and verified.


### Engineering lab course reader

The course reader is an instructional interface, not a condensed documentation page. Preserve these layers in this order:

1. State what changes in the current lab stage and where commands run.
2. Show the current topology checkpoint and the state the learner should have reached.
3. Give a short guided diagnostic path with explicit command context.
4. Keep an intentional break-and-restore experiment.
5. Include the complete maintained chapter explanation and task sequence.
6. Let the learner review the expected checkpoint observation after the practical work.
7. Put knowledge/command/troubleshooting questions after the chapter rather than interrupting every command.
8. Treat completion as an explicit learner action, not simply visiting the URL.

The canonical teaching loop is `build -> run -> observe -> break -> explain -> fix -> retest -> questions`. Do not reduce it to generic numbered cards or interrupt every command with a quiz. Errors, missing routes, permission failures, DNS failures, and recovery steps are part of the curriculum.

Commands must visibly distinguish execution context such as `HOST`, `HOST -> app-a-test`, `POSTGRES-REPLICA SHELL`, or `PSQL SESSION`. A terminal-styled block is only a copyable command surface; it must never imply the website executes commands.

The canonical public Docker Networking reader lives under `/labs/docker-networking/`. Its lesson prose must be present in the static HTML. The legacy `/network-series/` directory exists only for compatibility/source history; do not make it the public canonical route.

### Motion

Reveal effects use `[data-reveal]` and `.is-visible` in `script.js`. Any new animation must have a reduced-motion alternative. Motion should support hierarchy, not distract from content.

## Content Rules

- Prefer evidence-based statements: responsibilities, architecture patterns, tools, and measured outcomes.
- Keep metrics precise. Write `99.99% uptime` or `99.99% availability`, not `99.99 percentile`.
- Do not claim security certification, PCI compliance, zero downtime, scale, or performance guarantees without evidence.
- Keep project ownership statements accurate to the work actually performed.
- Explain limitations when a feature is partial, experimental, or not production-ready.

## Privacy and Security

This is a public static site. Never add:

- API keys, access tokens, passwords, webhook secrets, or private keys.
- Environment variable values, database DSNs, private endpoints, or server paths.
- Customer names, emails, phone numbers, addresses, orders, invoices, QR payloads, or private screenshots.
- Unsanitized logs, payment payloads, authentication tokens, or deployment credentials.

Describe integrations by capability, such as `Stripe webhooks` or `Google OAuth`, without publishing configuration values.

## Accessibility

- Keep one logical `h1` per page and maintain heading order.
- Preserve the skip link and semantic `main`, `nav`, `section`, and `footer` landmarks.
- Provide meaningful image alternatives; use empty `alt` text only for decorative images.
- Keep keyboard focus visible and controls usable at mobile widths.
- Preserve `aria-current`, `aria-expanded`, `aria-controls`, and live-region attributes where they are used.
- Test with reduced motion enabled and with the mobile navigation open.

## Update Checklist

1. Update the relevant page content and keep wording public-safe.
2. Update both `index.html` and `projects.html` when changing a featured project.
3. Replace preview images only with sanitized, locally stored assets.
4. Update `README.md`, `SITEMAP.md`, and `sitemap.xml` when canonical pages or navigation change.
5. Run `node --check script.js`.
6. Run `git diff --check`.
7. Serve the site locally and check all pages, links, images, mobile navigation, and the GitHub API fallback.

## Portfolio positioning rules

- Lead with backend engineering and production ownership. DevOps/platform/reliability depth should strengthen the backend story rather than compete with it.
- Prefer evidence over slogans: team leadership, production users, deployment improvements, database/storage improvements, observability, and shipped systems.
- The networking course demonstrates systems depth and technical communication. Avoid copy that makes it sound like a beginner career switch.
- Use `Work`, `Experience`, and `Labs` as the primary information architecture. Canonical public routes are semantic directories such as `/work/`, `/experience/`, `/labs/`, and `/labs/docker-networking/`; old `.html` and `/network-series/` URLs are redirects/source material only.
- Keep the public GitHub section curated. Do not automatically display the most recently pushed repositories.
- Do not use skill ratings, percentages, stars, beginner/intermediate/expert labels, or progress bars for technologies. Group tools by engineering function instead.
- Keep the course reader intentionally wider than the marketing/portfolio pages. Prose should retain a readable line length, while diagrams, code, and tables can use the available width.

## Labs architecture

- The global navigation gets exactly one `Labs` item.
- `/labs/` is the canonical lab library. Do not add one top-level nav item per lab.
- An active lab may have its own reader and chapter navigation under a dedicated directory.
- Planned labs should remain compact `Coming Soon` cards until the executable lab and teaching material are ready.
- Lab cards should communicate domain, status, purpose, and a few concepts without pretending unfinished material is available.
- Chapter questions belong after the practical chapter flow. Do not interrupt every command with quizzes.
- Small instructional text must remain readable: avoid 8–10px labels in the learning interface. Desktop course body text should normally be 16–18px and terminal text roughly 13–15px.


## Search and route rules

- Canonical host: `https://ayo-olowoleru.xyz`.
- Global nav uses semantic routes: `/work/`, `/experience/`, `/labs/`, `/about/`, `/contact/`.
- Do not make JavaScript the only source of chapter text. Lab lesson prose, headings, diagrams, and internal links must be present in static HTML.
- Lab landings must provide both Grid and List chapter views.
- One technical topic gets one canonical page; do not create near-duplicate keyword pages.
- Keep chapter titles descriptive (`Static Routing Between Docker Networks`) rather than relying on chapter numbers alone.
- Preserve the typography floor in the course: instructional labels should generally be 12–13px minimum, body copy 17px desktop, and terminal/code 14px desktop.

### Lab progress interaction

- Opening a chapter may mark it **In progress**, but must never mark it complete.
- Completion is explicit and belongs after the practical work and end-of-chapter review/checkpoint.
- Course maps should distinguish **Not started**, **In progress**, and **Complete** without proficiency scores or gamified skill ratings.
- Resume links may use the last meaningful chapter subsection stored in the browser.
- Local learning state must remain optional: the course content works without an account or backend.
- Explain privacy plainly: progress is stored in the current browser using local storage, not a tracking cookie.
- Provide export/import/reset controls before adding account infrastructure.
