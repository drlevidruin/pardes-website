# About Page Redesign Spec

**Date:** 2026-03-25  
**Source Direction:** owner-approved story-first About page direction in live implementation review

## Goal
Redesign the About page so it feels like a brand and story page, not a generic school-information page. The page should explain how Pardes began, what it believes, who leads it, and why families trust it, without drifting into admissions language or support-model framing.

## Design Decisions

### Hero
- Use a full-bleed image hero with a warm dark overlay.
- Keep the hero copy story-first and emotionally direct.
- Use a single Caveat section label: `About Pardes`.

### Story Section
- Replace the old mission-and-timeline page opening with a two-column story block.
- Left column explains the school’s growth from five children in a living room to two campuses.
- Right column uses milestone markers for 2011, 2017, 2023, and 2024.

### Beliefs Section
- Replace generic mission bullets with three clear belief statements:
  - Teach closely.
  - Live Judaism.
  - Build people.
- Keep the copy universal and premium. Avoid intervention or support-program language.
- Use green bold inline highlights instead of pills or badges.

### Leadership
- Keep leadership visible on the About page.
- Use the existing leadership roster but frame it as stewardship of The Pardes Way, not a staff directory dump.

### Proof Section
- Add a two-column proof section near the end of the page.
- One column covers accreditation and institutional standards.
- One column covers community trust and the Marseille Dr purchase.

### CTA
- End with a dark forest CTA band and a single `Get in Touch` button.
- CTA copy should invite conversation, not tours or applications.

## Content Rules
- No em dashes.
- Caveat only on section labels.
- Body copy minimum 16px on mobile.
- Body copy on light backgrounds must stay at `#424245` or darker.
- Header CTA on the About page should be `Meet the Team`.
- Do not use admissions-funnel language on this page.

## Implementation Notes
- Main files:
  - `pages/about.html`
  - `css/about-redesign.css`
  - `css/features.css`
  - `scripts/validate.js`
- The shared footer top-gap fix lives in `css/features.css` so it applies sitewide.
- Validator rules must allow the About page to intentionally use `data-cta="team"` in the shared shell.
