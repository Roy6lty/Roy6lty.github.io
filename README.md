# Ayo Olowoleru's Portfolio

A static engineering portfolio for Ayo Olowoleru, built with semantic HTML, responsive CSS, vanilla JavaScript, and progressive Three.js visualizations. The site positions Ayo first as a backend engineer with production, platform, and reliability ownership, then uses engineering labs to demonstrate deeper systems reasoning, debugging practice, and technical communication.

**Canonical site:** [ayo-olowoleru.xyz](https://ayo-olowoleru.xyz)

**Profile:** [github.com/Roy6lty](https://github.com/Roy6lty) | [LinkedIn](https://www.linkedin.com/in/ayo-olowoleru-a8ab7418a/)

## Public information architecture

- `/` — Home: fast professional story, strongest evidence, selected work, and routes to deeper proof.
- `/work/` — Work: engineering case studies, professional impact, platform systems, and curated repositories.
- `/experience/` — Experience: career progression, team context, responsibilities, measurable outcomes, and résumé access.
- `/labs/` — Engineering Lab Library: one scalable home for active and upcoming labs.
- `/labs/docker-networking/` — Active Docker/Linux networking lab with Grid/List chapter browsing.
- `/labs/docker-networking/<topic>/` — Pre-rendered, indexable lesson pages with descriptive topic URLs.
- `/about/` — Engineering philosophy: end-to-end thinking, evidence, ownership, and human review.
- `/contact/` — Simple contact conversion.
- `/assets/Ayo-Olowoleru-Resume.pdf` — Downloadable résumé.
- `/404.html` — Custom route-not-found page using the existing guide-character illustration.

Legacy `.html` and `/network-series/` paths remain only as compatibility redirect stubs. They are not canonical public routes.

## Portfolio positioning

The site should answer four questions quickly:

1. **What kind of engineer is Ayo?** A backend engineer with strong production and systems ownership.
2. **What value does he bring to a team?** Product backend delivery, repeatable releases, operational visibility, documentation, and failure analysis.
3. **What proves it?** Professional experience, measurable delivery improvements, production products, team leadership, and public engineering systems.
4. **What makes him different?** He follows a service past the endpoint into deployment, networking, observability, failure, and recovery.

The labs are supporting evidence for systems depth and technical communication. They should not be framed as a beginner career change into DevOps.

## Skills presentation rule

Do not add proficiency bars, percentages, star ratings, beginner/intermediate/expert labels, or numeric skill scores. Tools change and proficiency is context-dependent. Group tools by the kind of engineering work they support instead.

## Labs architecture

The global navigation gets exactly one **Labs** item. `/labs/` is the catalogue for every active and planned lab. Do not add one top-level navigation item per lab.

Current catalogue:

- **Docker Networking** — available.
- **Docker Configuration** — coming soon.
- **DevOps Reliability Failure** — coming soon.
- **Distributed Systems Engineering** — coming soon.
- **Linux Internals Monitor** — coming soon.

An individual lab owns its own landing page, chapter catalogue, reader, progress state, and diagrams. The Docker Networking landing page supports both **Grid** and **List** views, with the learner's preference stored locally in the browser.

## Course teaching model

Questions belong after the practical chapter, not before every command. The intended learning flow is:

```text
Build -> Run -> Observe -> Break -> Explain -> Fix -> Retest -> Questions
```

Small in-chapter interactions may support usability—copy command, reveal expected output, expand diagram, mark a task—but they should not interrupt the practical flow with constant quizzes.

Commands must visibly identify execution context such as `HOST`, `ROUTER`, `APP-A`, `POSTGRES-REPLICA SHELL`, or `PSQL SESSION`. Terminal-styled blocks are copyable command surfaces only; the website does not execute the learner's lab commands.

## SEO and static lesson model

The canonical host is `https://ayo-olowoleru.xyz`.

Portfolio pages use semantic directory routes. Docker Networking chapters use one descriptive canonical URL per technical topic, for example:

```text
/labs/docker-networking/static-routing/
/labs/docker-networking/packet-tracing/
/labs/docker-networking/iptables-firewall/
/labs/docker-networking/nat-gateway/
/labs/docker-networking/physical-replication/
```

Each canonical lesson contains its complete instructional text in static HTML before JavaScript runs. JavaScript is progressive enhancement only: copy buttons, chapter completion, Grid/List preference, checkpoint reveal, and end-of-chapter question interactions.

Each indexable page should have:

- a unique `<title>` and meta description;
- a canonical URL on `ayo-olowoleru.xyz`;
- Open Graph metadata;
- one clear `h1`;
- descriptive headings based on real learner questions and technical problems;
- visible internal links and related chapters;
- visible breadcrumbs, with `BreadcrumbList` structured data where appropriate.

The About page carries `ProfilePage` / `Person` structured data. Course lessons use `TechArticle` structured data where appropriate.

See `SEO_IMPLEMENTATION.md` for the implementation details and post-launch Search Console checklist.

## Search infrastructure

- `CNAME` declares `ayo-olowoleru.xyz` for GitHub Pages.
- `robots.txt` allows crawling and declares the canonical sitemap.
- `sitemap.xml` contains canonical semantic URLs only.
- `404.html` provides useful recovery routes.
- `assets/social-card.jpg` is the general portfolio sharing card.
- `assets/docker-networking-social.jpg` is the Docker Networking sharing card.

## Repository curation

The Work page deliberately uses hand-selected repositories. Do not switch it back to a “latest GitHub repos” API feed. A portfolio is curated evidence; the GitHub profile is the complete archive.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` and test the semantic routes directly, especially:

```text
/work/
/experience/
/labs/
/labs/docker-networking/
/labs/docker-networking/static-routing/
/about/
/contact/
/404.html
```

## Page-purpose rule

Each top-level page has one job:

- **Home** — fast professional story.
- **Work** — engineering case studies: context, decision, system, outcome.
- **Experience** — career evidence and progression.
- **Labs** — learning-system catalogue.
- **Individual lab** — technical learning environment.
- **About** — engineering philosophy.
- **Contact** — simple conversion.

Do not make every page a differently titled version of the homepage.

## Browser-local lab progress

The Labs learning UI stores progress in `localStorage` under the versioned key `ayo-labs-progress-v1`. It does not require an account, backend, or cookie banner.

For Docker Networking the browser stores:

- chapters visited and explicitly completed;
- the most recently visited chapter;
- the last tracked lesson section for resume links;
- checkpoint/review state;
- Grid/List preference.

Learners can export this state as JSON, import it in another browser, reset one lab, or clear all Ayo Labs learning data from the Docker Networking course page.

`/labs/lab-progress.js` owns the shared storage model. Individual labs should build on this API rather than creating unrelated localStorage keys. Cookies should be reserved for future authenticated sessions if a backend/account system is introduced.
