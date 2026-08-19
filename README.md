# Ayo Olowoleru's Portfolio

A recruiter-friendly static portfolio for Ayo Olowoleru, built with semantic HTML, responsive CSS, vanilla JavaScript, and progressive Three.js visualizations. It is designed to deploy directly to GitHub Pages and explains what Ayo offers as a backend and DevOps engineer.

**Live site:** [roy6lty.github.io](https://roy6lty.github.io)

**Profile:** [github.com/Roy6lty](https://github.com/Roy6lty) | [LinkedIn](https://www.linkedin.com/in/ayo-olowoleru-a8ab7418a/)

## Pages

- `index.html` - Home and portfolio overview
- `about.html` - Background, toolkit, and working principles
- `projects.html` - Product work, Series networking labs, load-testing platform, AWS target architecture, and live GitHub repository archive
- `series.html` - The infrastructure learning series, current Docker topology, and planned entries
- `contact.html` - Email, LinkedIn, and GitHub contact links
- `STYLE_GUIDE.md` - Design, content, accessibility, and privacy rules for future updates
- `SITEMAP.md` - Human-readable page and content map
- `sitemap.xml` - Canonical public URLs for search engines

## Technologies

- HTML5
- CSS3 with Grid, Flexbox, and responsive breakpoints
- Vanilla JavaScript for navigation, reveal effects, scroll state, and GitHub repository loading
- Three.js from a browser CDN for the current Docker network lab visualization, with a static inspector fallback
- GitHub Pages

## Featured work

- ExamCompanion - AI study and testing product with document ingestion, AssemblyAI audio transcription, YouTube-subtitle ingestion, PostgreSQL/pgvector retrieval, and Gemini/LangChain generation. Ayo led a four-person team from conception to launch in six months and built the AI integration and entire backend. The product has passed 3,000 monthly active users and generated more than $1,000 in revenue.
- EventTally - Event and ticketing platform with vendor discovery, organizer workflows, Stripe ticket payments, and QR-coded tickets. Ayo built the Go backend and payment integration, and the product has supported more than 100 events across Africa.
- PopLocal - Managed creator-campaign platform. Backend built with Supabase by Ayo.
- Network lab - The current Docker Compose learning topology from `k8-test-project/dockerfile.networklab.yaml`: six Alpine containers across two public, two internal app, and two internal database bridge networks.
- Load-testing platform - An in-progress Go platform with PostgreSQL, a queue, scheduler, worker runtime, Docker and Kubernetes deployers, and a planned AWS architecture managed with Terraform.

The product links open the live sites. Their preview images are stored locally in `assets/` so the portfolio remains reliable on GitHub Pages.

## DevOps value framing

The homepage describes DevOps through business outcomes rather than tool names:

- Faster, safer delivery through repeatable CI/CD and smaller changes.
- Reliability through monitoring, logs, health checks, and recovery paths.
- Scale through infrastructure and configuration expressed as code.
- Shared ownership across development, delivery, and operations.

This framing follows the outcomes and practices described by [Google Cloud DevOps](https://cloud.google.com/devops), [AWS DevOps](https://aws.amazon.com/devops/what-is-devops/), and [DORA's delivery performance metrics](https://dora.dev/guides/dora-metrics-four-keys/).

## Local preview

Because the project is static, it can be previewed with any local web server. For example:

```bash
python3 -m http.server
```

Then open `http://localhost:8000` in a browser.

## Content updates

- Add or edit project details in `projects.html`.
- Update the technology tags and biography in `about.html`.
- Update the contact links in `contact.html` and the shared footer in each page.
- Replace the preview files in `assets/` when updated product screenshots are available.
- The projects page reads public repositories from the `Roy6lty` GitHub profile and falls back to a profile link if the API is unavailable.
