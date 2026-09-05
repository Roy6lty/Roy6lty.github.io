# Portfolio Review — Implemented Changes

This pass applies the full-site hiring/positioning review while preserving the existing visual identity.

## Core positioning

The portfolio now leads with:

> Backend engineer with production, platform, and reliability ownership.

The site no longer frames infrastructure work as a beginner move into DevOps. The engineering lab is presented as evidence of systems depth, debugging discipline, reproducibility, and technical communication.

## Homepage

- Kept `Good software ships. Great software keeps working.` as the primary line.
- Replaced weak top-level metrics such as container count with professional evidence: five years of engineering, four developers led, and 3,000+ MAU.
- Added delivery/database/product impact evidence.
- Replaced the long generic “why teams need this” scroll story with compact claim + evidence cards.
- Added a professional experience preview.
- Promoted the distributed load-testing platform into selected work instead of using PopLocal as a top-three homepage proof point.
- Reframed the networking course as first-principles engineering depth.

## Navigation / IA

Primary navigation is now:

`Home / Work / Experience / Labs / About / Resume / Let's talk`

Existing URLs remain compatible (`projects.html` and `network-series/`).

## Experience

Added `experience.html` with production-safe professional history and measurable outcomes across:

- Herts Technologies / PAMS
- Kwam2 Enterprises / event and ticketing platform
- Exam Companion
- Photo-editing/sharing contract
- Herts Technologies / Pillar Medical EMR

The latest resume is included at `assets/Ayo-Olowoleru-Resume.pdf`.

## Work page

- Removed “what I am learning next” framing.
- Turned ExamCompanion into a clearer engineering case study with role, team, constraint, decisions, and outcome.
- Added a professional-impact section for work that has stronger hiring evidence than a public product screenshot.
- Kept EventTally and PopLocal as production product evidence without letting PopLocal dominate the portfolio narrative.
- Reframed the load-testing platform and networking lab as engineering systems.
- Replaced dynamic “latest GitHub repos” loading with curated repositories.

## About

- Reframed systems/DevOps interest as a consequence of production backend ownership.
- Removed beginner-learning language.
- Grouped technologies by engineering function rather than proficiency.
- Explicitly prohibits skill ratings/scores in the style guide.
- Reframed labs around reproducibility: predict, test, observe, break, explain, restore.

## Course reader

The original course felt small on large screens because:

1. the whole site frame was capped at 1280px;
2. the lesson body reserved 275px for the sidebar;
3. full lesson notes were capped at 900px;
4. README prose rendered at only 13px.

Changes:

- Course site frame now uses almost the full desktop viewport.
- Sidebar increased to 300px with more readable labels.
- Main lesson sections can use the expanded canvas.
- README prose is 16px on desktop with a readable maximum line length.
- Code is 13px and can use the full technical canvas.
- Tables, diagrams, commands, and diagnostic sections can use the wider area.
- Course-map copy and chapter summaries are also larger.

## Discoverability / polish

- Added a favicon.
- Added an Open Graph social-sharing card.
- Added chapter descriptions, canonical URLs, and social metadata.
- Added `robots.txt` and updated `sitemap.xml`.
- Added LinkedIn and Resume links to shared footers.
- Optimized large project preview images to WebP.

## Maintenance rules

See `README.md`, `STYLE_GUIDE.md`, and `SITEMAP.md` before future Codex changes. The important rules are now stored with the code so the portfolio is less likely to drift away from its intended narrative.
