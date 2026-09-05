# Site Map

Canonical host: `https://ayo-olowoleru.xyz`

The portfolio uses semantic directory routes. Legacy `.html` and `/network-series/` pages are compatibility redirect stubs only and should not be treated as canonical navigation destinations.

## Portfolio pages

| Page | Canonical URL | Purpose |
| --- | --- | --- |
| Home | `/` | Fast professional story and strongest evidence |
| Work | `/work/` | Engineering case studies and professional impact |
| Experience | `/experience/` | Career evidence, progression, responsibilities, measurable outcomes |
| Labs | `/labs/` | Catalogue for active and upcoming engineering labs |
| About | `/about/` | Engineering philosophy and working principles |
| Contact | `/contact/` | Simple route to email, LinkedIn, GitHub, and résumé |
| Résumé | `/assets/Ayo-Olowoleru-Resume.pdf` | Concise hiring document |
| 404 | `/404.html` | Route recovery with guide-character illustration |

## Docker Networking lab

| Page | Canonical URL |
| --- | --- |
| Course landing | `/labs/docker-networking/` |
| Containers Are Processes | `/labs/docker-networking/container-process/` |
| CIDR & Docker Bridges | `/labs/docker-networking/cidr-bridges/` |
| Network Namespaces | `/labs/docker-networking/network-namespaces/` |
| Linux Capabilities | `/labs/docker-networking/capabilities/` |
| Multi-homed Router | `/labs/docker-networking/router-container/` |
| Routed Network Chain (05B) | `/labs/docker-networking/routed-network-chain/` |
| Static Routing | `/labs/docker-networking/static-routing/` |
| Packet Tracing | `/labs/docker-networking/packet-tracing/` |
| iptables Firewall | `/labs/docker-networking/iptables-firewall/` |
| Private Networks | `/labs/docker-networking/private-networks/` |
| NAT Gateway | `/labs/docker-networking/nat-gateway/` |
| Docker DNS | `/labs/docker-networking/docker-dns/` |
| Nginx Public Access | `/labs/docker-networking/nginx-public-access/` |
| PostgreSQL Primary | `/labs/docker-networking/postgres-primary/` |
| PostgreSQL Process Model | `/labs/docker-networking/postgres-process-model/` |
| Physical Replication | `/labs/docker-networking/physical-replication/` |
| Runtime Persistence | `/labs/docker-networking/runtime-persistence/` |
| Failure Testing | `/labs/docker-networking/failure-testing/` |

The course landing supports **Grid** and **List** chapter views. Each lesson is pre-rendered static HTML with visible breadcrumbs, complete instructional content, related chapter links, and end-of-chapter review.

## Planned Labs

These currently appear as compact **Coming Soon** cards on `/labs/` and do not yet need separate indexable course trees:

- Docker Configuration Lab
- DevOps Reliability Failure Lab
- Distributed Systems Engineering Lab
- Linux Internals Monitor Lab

Create a dedicated semantic directory only when a lab has enough real material to be useful.

## Shared assets

- `styles.css` — portfolio design system and responsive layout.
- `script.js` — navigation, reveal effects, scroll state, and progressive visuals.
- `labs/docker-networking/course.css` — full-width technical course reader and Grid/List catalogue.
- `labs/docker-networking/course.js` — progressive course interactions and browser-local preferences/progress.
- `labs/docker-networking/diagrams/` — local course topology SVGs.
- `assets/social-card.jpg` — portfolio Open Graph image.
- `assets/docker-networking-social.jpg` — Docker Networking Open Graph image.
- `assets/patch-thinking.webp` — guide-character crop used by the 404 page.
- `assets/favicon.svg` — site icon.

## Maintenance rules

1. Keep navigation labels as `Home / Work / Experience / Labs / About / Resume / Let's talk`.
2. Do not add skill ratings or proficiency scores.
3. Keep GitHub repositories curated instead of dynamically sorted by recency.
4. Preserve measurable claims only when they come from real project/professional evidence.
5. Keep individual labs wider than normal portfolio pages on desktop.
6. New labs belong under `/labs/`, not in the global navigation.
7. Questions belong after practical chapter work.
8. Every new canonical public page must be added to `sitemap.xml` and this file.
9. Keep canonical URLs on `https://ayo-olowoleru.xyz`.
10. Keep core lesson content in static HTML; JavaScript should enhance, not create, indexable content.
