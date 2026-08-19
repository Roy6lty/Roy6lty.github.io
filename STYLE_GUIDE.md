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
4. Update `README.md`, `SITEMAP.md`, or `sitemap.xml` when pages or navigation change.
5. Run `node --check script.js`.
6. Run `git diff --check`.
7. Serve the site locally and check all pages, links, images, mobile navigation, and the GitHub API fallback.
