# Pardes Day School Website

## Project Overview

Static website for **Pardes Day School**, a Jewish day school in Miami Beach, FL serving 220+ students from 18 months through 8th grade across two campuses. The site is at **pardesdayschool.org** (domain owned, not yet pointed to hosting).

- **Owner**: Dr. Levi Druin (school head, non-developer)
- **Repo**: https://github.com/drlevidruin/pardes-website
- **Hosting**: GitHub Pages — https://drlevidruin.github.io/pardes-website/
- **Branch**: `main` (deploys automatically on push)

## Tech Stack

- **Pure static HTML/CSS/JS** — no framework, no build step, no package.json
- **Data layer**: JSON files in `data/` act as a lightweight CMS
- **JS bundle**: `assets/main-cpapzbpt.js` (minified, single file)
- **No server-side code** — everything runs in the browser

## Directory Structure

```
├── index.html                  # Homepage
├── pages/                      # All subpages
│   ├── about.html
│   ├── admissions.html
│   ├── contact.html
│   ├── elementary.html
│   ├── faq.html
│   ├── middle-school.html
│   ├── parents.html
│   ├── preschool.html
│   ├── staff.html
│   ├── student-life.html
│   └── support.html
├── admin/                      # Client-side admin panel (see Security section)
│   ├── index.html
│   └── admin-app.js
├── assets/
│   ├── main-cpapzbpt.js        # Minified JS bundle (handles all interactivity)
│   └── images/
│       ├── elementary/         # Elementary school photos
│       ├── preschool/          # Preschool photos
│       ├── logos/              # School logos
│       ├── uploads/            # Admin-uploaded images
│       └── og/                 # Open Graph social sharing images
├── css/
│   ├── alerts.css              # Announcement banner styles
│   └── features.css            # Shared styles for new features (scholarship callout, share button)
├── js/
│   ├── alerts.js               # Announcement banner (reads /data/alerts.json)
│   ├── site-shell.js           # Shared public header/footer custom elements
│   ├── panels.js               # Detail modal for panel cards on division pages
│   └── share.js                # Share button (Web Share API with clipboard fallback)
├── data/
│   ├── site.json               # School info, pillars, CTAs
│   ├── homepage.json           # Homepage content
│   ├── staff-leadership.json   # Staff bios
│   ├── faq.json                # FAQ entries
│   ├── testimonials.json       # Parent testimonials
│   ├── contact.json            # Campus addresses, hours, phone
│   ├── image-manifest.json     # Generated image catalog (see Image System)
│   └── alerts.json             # Announcement banner content (set active:false to hide)
└── .gitignore
```

## Data Files (data/)

These JSON files power the site content. The admin panel reads/writes them via the GitHub API.

| File | Purpose |
|------|---------|
| `site.json` | School name, tagline, contact info, social links, divisions, pillars |
| `homepage.json` | Homepage-specific content |
| `staff-leadership.json` | Staff names, roles, bios |
| `faq.json` | FAQ question/answer pairs |
| `testimonials.json` | Parent testimonials |
| `contact.json` | Campus addresses, phone numbers, school hours |
| `image-manifest.json` | Auto-generated catalog of all images with category pools |

## Image System

The JS bundle (`main-cpapzbpt.js`) dynamically loads images from `data/image-manifest.json` at runtime. The manifest organizes images into pools:

- `images` (210 total) — all images
- `heroCandidates` (11) — hero banner rotation
- `divisionsCandidates` (40) — division section backgrounds
- `galleryCandidates` (80) — photo gallery strips
- `preschoolCandidates` (40) — preschool-specific galleries
- `elementaryCandidates` (40) — elementary-specific galleries
- `logos` (1) — school logo

**Important**: Hero images in HTML use inline `style="background-image: ..."` as fallbacks. The JS overwrites these from the manifest via `[data-hero-image]` attributes. Both paths should be valid.

**Image directories that exist**: `assets/images/elementary/`, `assets/images/preschool/`, `assets/images/logos/`, `assets/images/uploads/`

**Directories that do NOT exist** (stale references were fixed 2026-03-22): `Website Pictures Elementary/`, `Gan Katan Website Pictures/`

### Preschool gallery naming
Former low-signal preschool upload filenames were standardized on 2026-03-22 to `preschool-gallery-01.jpeg` through `preschool-gallery-19.jpeg` so the manifest and validation script stay clean.

## Forms

Forms use **Formspree** (free tier, 50 submissions/month). Submissions go to the email registered on the Formspree account.

| Form | Page | Formspree ID |
|------|------|-------------|
| Contact | `pages/contact.html` | `xojkzodv` |
| Admissions Inquiry | `pages/admissions.html` | `mpqyegdp` |

**How it works**: Forms POST to `https://formspree.io/f/{id}` with `Accept: application/json` header. The JS handler in `main-cpapzbpt.js` intercepts submission, sends via fetch, and shows success/error messages inline. Spam protection uses a `_gotcha` honeypot field.

## Admin Panel (/admin/)

A client-side admin panel at `admin/index.html` for editing site content.

### How it works
1. User logs in with username + password + GitHub personal access token
2. Credentials are checked against a SHA-256 hash stored in `admin-app.js`
3. GitHub token is stored in `sessionStorage` (never persisted to disk)
4. Admin reads/writes JSON data files via the GitHub Contents API
5. Changes commit directly to `main` branch, triggering a GitHub Pages redeploy

### Security notes
- **Auth is client-side only** — the password hash is in the JS source. This is NOT real security.
- The login gate is sufficient for now since: (a) only the owner uses it, (b) the GitHub token is required for any writes, (c) the token is never committed to the repo
- **Do NOT add Basic Auth or Netlify/Vercel route protection** — the site is on GitHub Pages, which doesn't support those. If real auth is needed later, consider Firebase Auth or moving the admin to a separate private app.

## JS Bundle (assets/main-cpapzbpt.js)

Single minified file that handles all site interactivity:

- **Header scroll**: adds `is-scrolled` class on scroll
- **Mobile nav**: hamburger toggle for `[data-site-nav]`
- **Active nav**: highlights current page link via `aria-current`
- **FAQ accordion**: toggle open/close on `.faq-item` elements
- **Form handling**: intercepts `.js-lead-form` submissions, posts to Formspree via form's `action` attribute
- **Image loading**: fetches `image-manifest.json`, populates hero images, division backgrounds, gallery strips
- **Hero carousel**: auto-rotating hero with touch/swipe support
- **Reveal animations**: intersection observer for `[data-reveal]` elements

## Shared Public Shell

Public pages now use a shared light-DOM shell instead of duplicating full header/footer markup in every HTML file.

- `js/site-shell.js` defines `site-header` and `site-footer` custom elements
- Public pages declare their path context explicitly:
  - `data-context="root"` for `index.html`
  - `data-context="subpage"` for files in `pages/`
- Header CTA is explicit:
  - homepage uses `data-cta="team"`
  - subpages use `data-cta="tour"`
- The shell uses two fixed route maps (`root` and `subpage`) instead of inferred relative-path math
- The shared shell preserves the hooks the minified bundle expects: `data-nav-toggle`, `data-site-nav`, `data-nav-link`, and `data-logo`
- Minimal `noscript` navigation/contact fallback blocks remain in each public page because GitHub Pages does not have a server-side include layer
- `scripts/validate.js` now checks public shell configuration, including required shell placeholders, explicit context/CTA values, `site-shell.js` inclusion before the main bundle, and rejection of legacy duplicated header/footer markup

## Hosting & Deployment

- **GitHub Pages** serves the site from the `main` branch root
- Every push to `main` triggers an automatic redeploy (takes ~1 minute)
- **Custom domain** (`pardesdayschool.org`) is owned but not yet configured. To connect:
  - Run: `gh api repos/drlevidruin/pardes-website/pages -X PUT -f cname="pardesdayschool.org"`
  - Add DNS A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - Add DNS CNAME for `www` → `drlevidruin.github.io`

## Git Workflow

- **Always push to GitHub after committing** — local and remote must stay in sync
- **Always pull before starting work** — other agents (Codex, Codex) may have pushed changes
- Commit messages should be descriptive and mention what was changed and why

## Agent Collaboration

This repo is actively worked on by both **Codex** and **OpenAI Codex**. Coordination rules:

1. **Read this file first** before making changes to understand current state
2. **Pull before starting work** to get the latest from the other agent
3. **Always commit AND push** — every change must be committed and pushed to `origin main` before finishing. Never leave uncommitted or unpushed work. This is non-negotiable.
4. **Run `node scripts/validate.js` before deploy-adjacent pushes** when you touch HTML, assets, or the image manifest. It checks broken asset refs, stale image directories, manifest integrity, secret-like literals, and junk image filenames.
5. **Update this file** if you make architectural changes, add new features, or change how something works
6. **Don't work on the same files simultaneously** — coordinate via the owner

## Change Log

| Date | Agent | Changes |
|------|-------|---------|
| 2026-03-22 | OpenAI Codex | Completed consistency and technical polish pass: standardized Preschool (Gan Katan) naming across site content and data files, removed Photo Strip labels on preschool and elementary pages, updated homepage stat copy, added two-campus Google Maps embeds on contact page, improved descriptive alt text, and added noscript gallery fallbacks across dynamic gallery sections |
| 2026-03-22 | OpenAI Codex | Standardized 19 preschool gallery filenames and updated `data/image-manifest.json` so validation passes without junk filename findings |
| 2026-03-22 | OpenAI Codex | Completed SEO foundation refresh: GitHub Pages canonicals and OG tags on public pages, new favicon set, sitemap.xml, robots.txt, and expanded homepage School JSON-LD with founding date and geo coordinates |
| 2026-03-22 | OpenAI Codex | Added `scripts/validate.js`, a dependency-free predeploy validator for HTML asset refs, stale image directories, secret-like literals, image manifest integrity, and junk image filenames |
| 2026-03-22 | Codex | Switched forms from Netlify to Formspree (contact: xojkzodv, admissions: mpqyegdp) |
| 2026-03-22 | Codex | Removed plaintext password comment from admin-app.js |
| 2026-03-22 | Codex | Fixed all broken image paths across 11 pages (Website Pictures Elementary → elementary, Gan Katan Website Pictures → preschool) |
| 2026-03-22 | Codex | Added announcement banner system: /data/alerts.json + /js/alerts.js + /css/alerts.css (loaded on all pages) |
| 2026-03-22 | Codex | Added Step Up For Students scholarship callout on admissions page (#71) |
| 2026-03-22 | Codex | Added share button (Web Share API) on admissions and contact pages: /js/share.js + styles in /css/features.css |
| 2026-03-22 | Codex | Created OG sharing image: /assets/images/og/og-share.svg (1200x630 branded card for social previews) |
| 2026-03-22 | Codex | Disabled announcement banner (active:false). Owner wants to re-enable later this week after mobile spacing is fixed. Banner pushes content down and has too much whitespace on mobile. Before re-enabling: fix mobile padding so banner sits tighter, and reduce gap between banner and hero section. |
| 2026-03-25 | Codex | Replaced duplicated public-page header/footer markup with `site-header` and `site-footer` from /js/site-shell.js, added explicit root/subpage shell contexts plus minimal noscript fallback blocks, and extended /scripts/validate.js to enforce shell configuration rules |
| 2026-03-25 | Codex | Polished homepage/footer seam spacing by removing the shared top margin on `site-footer .site-footer` in /css/features.css so final CTA bands sit directly above the footer |
| 2026-03-25 | Codex | Rebuilt /pages/about.html as a story-first About page with new /css/about-redesign.css, switched the About page header CTA to `Meet the Team`, and updated /scripts/validate.js to allow that shell configuration |
| 2026-03-25 | Codex | Added `About Pardes` to the shared `About Us` nav dropdown in /js/site-shell.js and swapped the About page hero to a calmer classroom image with a shorter first viewport in /css/about-redesign.css |
| 2026-03-25 | Codex | Tightened the About page hero again in /css/about-redesign.css so the next section visibly peeks into the first screen, and changed the bottom `Get in Touch` button to a high-contrast light treatment on the dark green CTA band |
| 2026-03-25 | Codex | Simplified the About hero by removing the hero label, cutting it to one supporting line, moving the text block higher, tightening the classroom photo crop, and softening the hero-to-story overlap so the page flows more cleanly on desktop and mobile |
| 2026-03-25 | Codex | Refined the About hero again by removing the supporting sentence entirely and centering the headline block higher within the hero image so the first white story section no longer feels crowded or clipped at the fold |
| 2026-03-25 | Codex | Added top and bottom breathing room back into the headline-only About hero in /css/about-redesign.css so the title no longer feels squashed inside the image on desktop or mobile |
| 2026-03-25 | Codex | Increased spacing under the `Built in Miami Beach. Built on purpose.` heading and changed the dark green CTA label to pure white in /css/about-redesign.css so both the story intro and CTA band read more clearly |
| 2026-03-25 | Codex | Fixed a selector-specificity bug in /css/about-redesign.css so the About page CTA label `Get in Touch` now actually renders white on the dark green CTA band instead of inheriting the default forest-green section-label color |
| 2026-03-25 | Codex | Warmed up the About page story copy in /pages/about.html by removing building and funding language, replaced colder institutional phrasing with friendlier school-story language, and rebalanced the story timeline in /css/about-redesign.css into a more symmetrical two-column layout |
| 2026-03-25 | Codex | Added more breathing room to the About page story copy and lowered the timeline start in /css/about-redesign.css so the milestones align with the body text rather than the section heading |
| 2026-03-25 | Codex | Restored the earlier About page story spacing in /css/about-redesign.css after the timeline was pushed too low, and updated the final milestone year in /pages/about.html from `2024` to `2026` so the school timeline does not feel dated |
| 2026-03-25 | Codex | Changed the About page timeline in /css/about-redesign.css from a two-up grid to a single vertical sequence so the milestones read one after another instead of two per row |
| 2026-03-25 | Codex | Added a cache-busting version query to the About page stylesheet link in /pages/about.html so browsers stop serving stale cached CSS during the timeline/layout fixes |
