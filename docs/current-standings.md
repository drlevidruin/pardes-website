# Pardes Website Current Standings

Last updated: 2026-03-26

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

## Known Open Items

- Announcement banner is still disabled in `data/alerts.json`.
- Before re-enabling the banner, mobile spacing still needs a careful pass so it does not create excess whitespace above the hero.
- About page has already gone through many spacing iterations. If more work is done there, keep it focused and verify on the live site after deploy.

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
- Repo: `https://github.com/drlevidruin/pardes-website`
