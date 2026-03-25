# About Page Redesign Implementation Plan

**Goal:** Replace the legacy About page with a story-first redesign and tighten the CTA-to-footer spacing sitewide.

**Spec:** `docs/superpowers/specs/2026-03-25-about-redesign-design.md`

## Tasks

### 1. Rebuild the About page structure
- Replace the old page hero, mission, timeline, accreditation, and visit blocks in `pages/about.html`.
- Add a new story-first section order:
  - hero
  - story
  - beliefs
  - leadership
  - proof
  - soft CTA
- Keep the shared shell and page-level content only.

### 2. Add page-specific About styling
- Create `css/about-redesign.css`.
- Use a full-bleed hero, restrained section styling, and editorial spacing instead of generic panels.
- Keep mobile body text at 16px minimum and preserve strong contrast.

### 3. Apply CTA and footer spacing cleanup
- Remove the extra visual gap before the shared footer in `css/features.css`.
- Keep the seam tight between the final CTA band and the footer across redesigned pages.

### 4. Align shared-shell validation
- Update `scripts/validate.js` so the About page is allowed to use `data-cta="team"` while still enforcing shell rules on all other public pages.

### 5. Verify and deploy
- Run `node scripts/validate.js`.
- Smoke check the About page in headless desktop and mobile browser passes.
- Confirm:
  - hero reads cleanly on desktop and mobile
  - story sections appear in the right order and feel distinct
  - CTA-to-footer spacing is tight
  - header CTA is `Meet the Team`
- Commit and push to `origin main`.
