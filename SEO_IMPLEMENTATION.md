# SEO and Information Architecture Implementation

Canonical domain: `https://ayo-olowoleru.xyz`

## Public routes

- `/` — professional identity and backend engineering positioning
- `/work/` — engineering case studies
- `/experience/` — professional history and impact
- `/labs/` — engineering lab library
- `/about/` — engineering philosophy and Person/ProfilePage entity
- `/contact/` — contact conversion
- `/labs/docker-networking/` — Docker Networking topic hub
- `/labs/docker-networking/<topic>/` — static, indexable chapter pages

Legacy `.html` and `/network-series/chapter-XX.html` pages are compatibility redirect stubs with `noindex,follow` and canonical links to the semantic routes.

## Course SEO model

Every Docker Networking chapter now ships its complete maintained lesson content in the HTML response. JavaScript is used only for enhancement: copy buttons, browser-local completion, the Grid/List course-map preference, reveal/checkpoint behavior, and end-of-chapter questions.

Each chapter has:

- a unique descriptive `<title>` and meta description;
- a canonical `ayo-olowoleru.xyz` URL;
- Open Graph metadata;
- a lab-specific social image;
- visible breadcrumbs plus `BreadcrumbList` JSON-LD;
- `TechArticle` JSON-LD;
- a descriptive topic route;
- an “In this chapter” anchor index generated from lesson headings;
- related-chapter internal links;
- one H1 and descriptive H2/H3/H4 lesson headings.

## Course navigation

The course landing page offers both **Grid** and **List** chapter views. The preference is stored in `localStorage` and does not require an account.

## Search infrastructure

- `CNAME` contains `ayo-olowoleru.xyz` for GitHub Pages.
- `robots.txt` points to `https://ayo-olowoleru.xyz/sitemap.xml`.
- `sitemap.xml` contains only canonical semantic routes.
- `404.html` uses the existing Patch systems-guide illustration and routes users back to Home, Labs, or Work.

## Deployment follow-up

After deploying and configuring the custom domain, add `ayo-olowoleru.xyz` to Google Search Console, submit `/sitemap.xml`, and inspect the homepage, `/labs/`, `/labs/docker-networking/`, and several chapter URLs for canonical/indexing status.
