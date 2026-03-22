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
│       └── uploads/            # Admin-uploaded images
├── data/
│   ├── site.json               # School info, pillars, CTAs
│   ├── homepage.json           # Homepage content
│   ├── staff-leadership.json   # Staff bios
│   ├── faq.json                # FAQ entries
│   ├── testimonials.json       # Parent testimonials
│   ├── contact.json            # Campus addresses, hours, phone
│   └── image-manifest.json     # Generated image catalog (see Image System)
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

### Known image cleanup needed
Some files in `assets/images/preschool/` have junk names (`ddd.jpeg`, `hghgh.jpeg`, `erere.jpeg`, `dfdfd.jpeg`) that are likely test uploads. These should be reviewed and either renamed or removed from the manifest rotation.

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

## Hosting & Deployment

- **GitHub Pages** serves the site from the `main` branch root
- Every push to `main` triggers an automatic redeploy (takes ~1 minute)
- **Custom domain** (`pardesdayschool.org`) is owned but not yet configured. To connect:
  - Run: `gh api repos/drlevidruin/pardes-website/pages -X PUT -f cname="pardesdayschool.org"`
  - Add DNS A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - Add DNS CNAME for `www` → `drlevidruin.github.io`

## Git Workflow

- **Always push to GitHub after committing** — local and remote must stay in sync
- **Always pull before starting work** — other agents (Claude Code, Codex) may have pushed changes
- Commit messages should be descriptive and mention what was changed and why

## Agent Collaboration

This repo is actively worked on by both **Claude Code** and **OpenAI Codex**. Coordination rules:

1. **Read this file first** before making changes to understand current state
2. **Pull before starting work** to get the latest from the other agent
3. **Always commit AND push** — every change must be committed and pushed to `origin main` before finishing. Never leave uncommitted or unpushed work. This is non-negotiable.
4. **Run `node scripts/validate.js` before deploy-adjacent pushes** when you touch HTML, assets, or the image manifest. It checks broken asset refs, stale image directories, manifest integrity, secret-like literals, and junk image filenames.
5. **Update this file** if you make architectural changes, add new features, or change how something works
6. **Don't work on the same files simultaneously** — coordinate via the owner

## Change Log

| Date | Agent | Changes |
|------|-------|---------|
| 2026-03-22 | OpenAI Codex | Added `scripts/validate.js`, a dependency-free predeploy validator for HTML asset refs, stale image directories, secret-like literals, image manifest integrity, and junk image filenames |
| 2026-03-22 | Claude Code | Switched forms from Netlify to Formspree (contact: xojkzodv, admissions: mpqyegdp) |
| 2026-03-22 | Claude Code | Removed plaintext password comment from admin-app.js |
| 2026-03-22 | Claude Code | Fixed all broken image paths across 11 pages (Website Pictures Elementary → elementary, Gan Katan Website Pictures → preschool) |
