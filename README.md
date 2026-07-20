# Ayo Olowoleru's Portfolio

A recruiter-friendly static portfolio for Ayo Olowoleru, built with semantic HTML, responsive CSS, and vanilla JavaScript. It is designed to deploy directly to GitHub Pages and highlights backend, AI integration, cloud, and systems work.

**Live site:** [roy6lty.github.io](https://roy6lty.github.io)

**Profile:** [github.com/Roy6lty](https://github.com/Roy6lty) | [LinkedIn](https://www.linkedin.com/in/ayo-olowoleru-a8ab7418a/)

## Pages

- `index.html` - Home and portfolio overview
- `about.html` - Background, toolkit, and working principles
- `projects.html` - ExamCompanion, EventTally, PopLocal, and live GitHub repository archive
- `contact.html` - Email, LinkedIn, and GitHub contact links
- `STYLE_GUIDE.md` - Design, content, accessibility, and privacy rules for future updates
- `SITEMAP.md` - Human-readable page and content map
- `sitemap.xml` - Canonical public URLs for search engines

## Technologies

- HTML5
- CSS3 with Grid, Flexbox, and responsive breakpoints
- Vanilla JavaScript for navigation, reveal effects, and GitHub repository loading
- GitHub Pages

## Featured work

- ExamCompanion - AI study and testing product with document ingestion, AssemblyAI audio transcription, YouTube-subtitle ingestion, PostgreSQL/pgvector retrieval, and Gemini/LangChain generation. AI integration and entire backend built by Ayo, including JWT/OAuth authentication with email verification, 2FA, protected study workflows, and Google OAuth. GitHub Actions CI/CD reduced deployment time by 13% while supporting 99.99% uptime.
- EventTally - Event and ticketing platform with vendor discovery, organizer workflows, Stripe ticket payments, and QR-coded tickets. Go backend and payment integration by Ayo, including JWT authentication, Google OAuth, and protected account flows. GitHub Actions CI/CD reduced deployment time by 13% while supporting 99.99% uptime.
- PopLocal - Managed creator-campaign platform. Backend built with Supabase by Ayo.

The product links open the live sites. Their preview images are stored locally in `assets/` so the portfolio remains reliable on GitHub Pages.

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
