# Pardes Website Current Standings

Last updated: 2026-03-27

## Current State

- Deploy branch is `main`.
- Public site deploys from GitHub Pages.
- Shared public header/footer shell is live and centralized in `js/site-shell.js`.
- Homepage and About page have both been actively redesigned and polished.
- Current design workflow docs are:
  - `docs/process_page_redesign.md`
  - `docs/design_rules_pardes.md`
- Current homepage reference files are:
  - `docs/superpowers/specs/2026-03-25-homepage-story-polish-design.md`
  - `docs/superpowers/plans/2026-03-25-homepage-story-polish.md`
  - `docs/superpowers/mockups/2026-03-25-homepage-story-polish-v3.html`
- Current About page reference files are:
  - `docs/superpowers/specs/2026-03-25-about-redesign-design.md`
  - `docs/superpowers/plans/2026-03-25-about-redesign.md`

## What We Finished

### 1. Shared Public Shell

- All public pages now use shared `site-header` and `site-footer` elements instead of duplicated header/footer HTML.
- The shell uses explicit `root` and `subpage` contexts instead of fragile relative-path guessing.
- `About Pardes` was added to the `About Us` dropdown.

Main files:
- `js/site-shell.js`
- `css/features.css`
- `scripts/validate.js`
- `index.html`
- `pages/*.html`

### 2. Homepage

- Homepage was kept story-first, not admissions-first.
- Hero headline stays: `The school you wish you had growing up.`
- Proof area was tightened and moved into the first viewport.
- Footer seam spacing was cleaned up.
- Copy was revised to avoid support-model language and admissions-funnel tone.
- Homepage FAQ and CTA were shifted toward brand/story language.

Main files:
- `index.html`
- `css/homepage-redesign.css`
- `css/mobile-fixes.css`

### 3. About Page

- About page was rebuilt as a story-first page.
- Hero was redesigned and simplified.
- Story section copy was warmed up and money/building language was removed.
- Timeline now uses a single vertical sequence, not a two-up layout.
- Final timeline year was updated to `2026` so the page does not feel dated.
- About page header CTA is `Meet the Team`.
- About stylesheet link has a version query to force CSS refresh when changes are pushed.

Main files:
- `pages/about.html`
- `css/about-redesign.css`

## About Page: Latest Live Intent

This is the current intended About layout:

- Left side: story label, large headline, story copy.
- Right side: single-column vertical timeline.
- Desktop timeline should sit higher, starting closer to the `It started...` headline.
- The section should feel balanced, warmer, and less institutional.

If the live page ever looks wrong after a push:

- First suspect browser cache.
- Hard refresh the About page.
- Check that `pages/about.html` is loading the current versioned stylesheet query.

### 4. Storytelling Features (2026-03-27)

Six new features were brainstormed, specced, and fully implemented in one session. All are live and working but some need real content from Levi.

**Gallery Page** (`pages/gallery.html`)
- New page added to the nav (Gallery link)
- Photo grid with category filter pills (Classroom Life, Gan Katan, School Events)
- Full-screen lightbox with prev/next arrow navigation and keyboard support
- Currently populated with 27 existing school photos — works but needs organized/curated gallery photos
- Supports video items too (type: "video" in `data/gallery.json`) — no videos uploaded yet
- Files: `js/gallery.js`, `js/gallery-lightbox.js`, `data/gallery.json`

**Newsletter Archive** (`pages/newsletter.html`)
- New page added to the nav (Newsletter link)
- Shows a grid of newsletter issue cards; clicking opens a page-image viewer modal
- Currently shows an empty state ("Coming soon") because no issues have been added yet
- **To add a newsletter**: Export each page from Canva as an image, put them in `assets/images/newsletters/`, then add an entry to `data/newsletters.json` with the title, cover, and page image paths
- Files: `js/newsletter.js`, `js/newsletter-viewer.js`, `data/newsletters.json`

**School Calendar** (on `pages/parents.html`)
- Renders a dated list of school events grouped by month
- Type badges: Holiday, No School, Early Dismissal, Event
- Currently has rest-of-year dates (Pesach break through last day of school 2025-2026)
- **To update**: Edit `data/calendar.json` — each entry has `date` (ISO format), `label`, and `type`
- Files: `js/calendar.js`, `data/calendar.json`

**Staff Lightbox Bios** (on `pages/staff.html`)
- Clicking a staff card with a photo opens a lightbox showing a larger photo + bio + standout detail
- All 48 staff members have placeholder bios based on their role/division
- **Action needed**: Staff should review and fill in their real bios in `data/staff-leadership.json` (fields: `bio` and `standout`)
- Files: `js/staff-lightbox.js`, `data/staff-leadership.json`

**Scattered Testimonials** (across multiple pages)
- Pull quotes and family story cards that appear on targeted pages
- Each testimonial in `data/testimonials.json` has a `pages` array that controls where it shows up
- Pull quotes insert before the soft-CTA section; story cards insert before the admissions form
- Currently 9 testimonials: 6 pull quotes on various pages, 3 story cards on admissions
- **Action needed**: Replace placeholder testimonials with real family quotes
- Files: `js/testimonials.js`, `data/testimonials.json`

**Shared Styles**
- All storytelling feature styles live in `css/storytelling.css`
- Loaded on every page via `<link>` tag
- Responsive at 1024px and 768px breakpoints

**Design Spec**: `docs/superpowers/specs/2026-03-27-site-storytelling-features-design.md`

## Known Open Items

- Announcement banner is still disabled in `data/alerts.json`.
- Before re-enabling the banner, mobile spacing still needs a careful pass so it does not create excess whitespace above the hero.
- About page has already gone through many spacing iterations. If more work is done there, keep it focused and verify on the live site after deploy.
- **Storytelling features need real content** — see checklist below.
- Gallery and Newsletter pages have not been visually reviewed on mobile yet.

## Content Levi Needs to Provide

| Item | Where it goes | How to do it |
|------|--------------|-------------|
| Curated gallery photos | `data/gallery.json` + image files | Organize photos, add entries to gallery.json pointing to image paths |
| Video clips (optional) | `data/gallery.json` | Add items with `"type": "video"` and a YouTube/Vimeo embed URL |
| Newsletter Canva exports | `data/newsletters.json` + `assets/images/newsletters/` | Export each page as image, add issue entry to newsletters.json |
| Real family testimonials | `data/testimonials.json` | Replace placeholder quotes with real ones, keep the `pages` array targeting |
| Staff real bios | `data/staff-leadership.json` | Have each staff member review their `bio` and `standout` fields |
| Calendar updates for next year | `data/calendar.json` | Update dates when 2026-2027 calendar is finalized |

## Recommended Next Page

Best next redesign candidates:

1. `pages/admissions.html`
2. `pages/staff.html`
3. `pages/student-life.html`

Recommendation:
- Do `Admissions` next only if it is being reframed as a brand/trust page, not a funnel page.
- Otherwise `Staff` is a good next page because the shared shell is already stable and `Meet the Team` is now wired correctly.

## How To Resume

1. Pull latest `main`.
2. Read:
   - `docs/process_page_redesign.md`
   - `docs/design_rules_pardes.md`
   - relevant page spec/plan files under `docs/superpowers/`
3. Use the 7-step page redesign process.
4. Mockup first, then spec, then plan, then implementation.
5. Run `node scripts/validate.js` before pushing.
6. Commit and push every completed change to `main`.

## Useful URLs

- Live site: `https://drlevidruin.github.io/pardes-website/`
- About page: `https://drlevidruin.github.io/pardes-website/pages/about.html`
- Gallery: `https://drlevidruin.github.io/pardes-website/pages/gallery.html`
- Newsletter: `https://drlevidruin.github.io/pardes-website/pages/newsletter.html`
- Parents (calendar): `https://drlevidruin.github.io/pardes-website/pages/parents.html`
- Staff (lightbox bios): `https://drlevidruin.github.io/pardes-website/pages/staff.html`
- Repo: `https://github.com/drlevidruin/pardes-website`
