# Homepage Story Polish Implementation Plan

**Goal:** Apply the 2026-03-25 homepage story polish mockup to the live homepage without changing the overall page architecture.

**Spec:** `docs/superpowers/specs/2026-03-25-homepage-story-polish-design.md`  
**Mockup:** `docs/superpowers/mockups/2026-03-25-homepage-story-polish-v3.html`

## Tasks

### 1. Update homepage copy and metadata
- Replace the homepage meta description, OG description, and JSON-LD description with story-first language.
- Keep the hero headline unchanged.
- Replace Pardes Way intro copy, pillar copy, FAQ copy, and soft CTA copy with the approved story polish version.
- Remove `LeHashlim` from homepage copy.

### 2. Flatten the proof bar and tighten homepage styles
- Replace `proof-card` markup in `index.html` with `proof-item`.
- Update `css/homepage-redesign.css` to style the flatter proof treatment and avoid collisions with the bundled `proof-card` styles.
- Raise division body text and mobile pillar body text to the 16px minimum.
- Keep the existing motion model only: hero Ken Burns, reveal transitions, and division hover.

### 3. Clean homepage mobile CSS layering
- Remove the homepage hero overrides from `css/mobile-fixes.css`.
- Keep homepage mobile spacing and hero behavior inside `css/homepage-redesign.css`.
- Verify the homepage still renders correctly with the shared header on mobile.

### 4. Verify and deploy
- Run `node scripts/validate.js`.
- Smoke check the live homepage in headless desktop and mobile browser passes.
- Confirm:
  - proof bar feels flatter and faster to scan
  - homepage copy no longer reads like support-model or admissions copy
  - divisions still provide clear structure
  - FAQ is story-driven
  - CTA stays soft and conversation-first
- Commit and push to `origin main`.
