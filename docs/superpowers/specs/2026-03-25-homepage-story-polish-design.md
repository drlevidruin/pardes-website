# Homepage Story Polish Spec

**Date:** 2026-03-25  
**Previous Mockup:** `.superpowers/brainstorm/15431-1774271341/homepage-mockup-v2.html`  
**Approved Polish Mockup:** `docs/superpowers/mockups/2026-03-25-homepage-story-polish-v3.html`

## Goal
Sharpen the existing homepage so it tells the Pardes story more clearly without changing the page architecture. The homepage should feel like a brand showcase for a full school, not an admissions funnel and not a support-model page.

## Design Decisions

### Hero
- Keep the current hero headline exactly: "The school you wish you had growing up."
- Keep the current full-bleed photo, warm overlay, and Ken Burns motion.
- Keep the current shared header and footer shell unchanged.

### Proof Bar
- Keep the proof section as a fast-scanning stat bar with the same 4 facts.
- Change the proof treatment from the current `proof-card` markup to a flatter `proof-item` treatment so it no longer reads like soft promo cards.
- Final labels:
  - `15+` Years Serving Miami Beach Families
  - `220+` Students Learning Together
  - `2+` Teachers in Every Classroom
  - `Pre-K-8` One School. One Philosophy.

### The Pardes Way Intro
- Keep the heading: "Education redesigned. On purpose."
- Replace the intro paragraph with:
  - "We rebuilt how school works so children get more attention, more practice, and more purpose every single day."
- Do not add a separate origin or philosophy section.

### Pillars
- Keep the current 3-pillar structure and image order.
- Rewrite pillar copy to remove support-style framing.

**Pillar 1: Multiple Teachers. Precision Academics.**
- Keep the headline and image.
- Reframe multiple teachers as a premium classroom model for all students.
- Keep `NWEA MAP Growth data` as a green bold highlight.
- Remove phrases like "This isn't an aide sitting in the corner" and "exactly the right level."

**Pillar 2: Practical Jewish Living.**
- Keep the approved copy direction and the sage background.
- Keep `Chumash and Kriah` and `Shabbat assembly` as green bold highlights.

**Pillar 3: Built for Life, Not Just School.**
- Keep the headline and image.
- Remove the `LeHashlim` name from the homepage.
- Replace it with universal real-life-skills language.
- Keep `real-life skills are taught alongside Chumash and math` and `practice time is built into the school day` as green bold highlights.

### Divisions
- Keep the divisions section on the homepage in the same place.
- Keep the current 3-card structure because it proves Pardes has clear age-level structure.
- Tighten Elementary copy so it feels story-first and premium, not operational.
- Raise division card paragraph body copy to 16px minimum.

### Student Life
- Keep the section structure, heading, and photo-grid concept.
- No new copy block is needed here.

### FAQ
- Keep the 3-question accordion format.
- Replace admissions and scholarship questions with story questions:
  1. What makes The Pardes Way different from other schools?
  2. How is Jewish life woven into the day?
  3. Why do families say life feels calmer at Pardes?
- Keep the link to the full FAQ page.

### Soft CTA
- Keep the dark forest CTA band and `Get in Touch` button.
- Replace the headline and supporting lines with softer conversation-first copy:
  - Heading: "Want to get to know Pardes?"
  - Copy:
    - "We would be glad to answer questions."
    - "Introduce our team."
    - "Help you get a feel for the school."

### Metadata
- Update the homepage meta description and OG description to match the story-first positioning.
- Update the homepage JSON-LD description to align with the same story.

## Typography And Color Rules
- No em dashes anywhere.
- Caveat only on section labels. Maximum one use per section.
- Green bold `<strong>` highlights only. No pill or badge styling.
- Body text minimum 16px on mobile and minimum color `#424245` on light backgrounds.
- Keep spacing tight. No new padded filler sections.

## Implementation Notes
- Homepage-specific mobile behavior should live in `css/homepage-redesign.css`.
- `css/mobile-fixes.css` should stop carrying homepage hero spacing rules.
- No new JS behavior is needed. Existing reveal, nav, logo, and shell behavior stay intact.
