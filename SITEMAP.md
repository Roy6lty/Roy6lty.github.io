# Site Map

The portfolio is a static GitHub Pages site. Page navigation is repeated in each HTML entry point, so update the header and footer consistently when adding a page.

## Public Pages

| Page | URL | Purpose | Main content |
| --- | --- | --- | --- |
| Home | `/index.html` | First impression and overview | Identity, offer, product evidence, and current networking lab |
| About | `/about.html` | Background and working approach | Who Ayo is, why DevOps, tools, principles, collaboration fit |
| Projects | `/projects.html` | Detailed project evidence | Products, Series networking labs, load-testing platform, AWS target diagram, GitHub archive |
| Series | `/series.html` | Infrastructure learning record | Series introduction, current Docker topology, and planned networking and operations entries |
| Contact | `/contact.html` | Contact routes | Email, LinkedIn, GitHub |

## Shared Assets

- `styles.css` contains design tokens, layout, components, responsive rules, and animations.
- `script.js` handles mobile navigation, reveal effects, scroll state, GitHub repository loading, and the two Three.js concept views.
- `assets/examcompanion-home.png` is the ExamCompanion preview.
- `assets/eventtally-preview.png` is the EventTally preview.
- `assets/poplocal-preview.png` is the PopLocal preview.

## Content Relationships

- `index.html` gives each featured project a concise summary and product link.
- `projects.html` is the source for detailed project claims and technical scope.
- `about.html` provides shared background, toolkit, and working principles.
- `README.md` documents the repository and featured work for maintainers.
- `sitemap.xml` lists the canonical public URLs for search engines.

## Future Page Convention

When adding a page:

1. Copy the shared header and footer structure from the closest existing page.
2. Add a unique `body` page class and canonical URL.
3. Add the page to every primary navigation instance.
4. Add the page to this document and `sitemap.xml`.
5. Preserve the public-safe content rules in `STYLE_GUIDE.md`.
