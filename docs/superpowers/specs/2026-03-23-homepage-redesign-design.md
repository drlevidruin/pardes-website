# Homepage Redesign Spec

**Date:** 2026-03-23
**Mockup:** `.superpowers/brainstorm/15431-1774271341/homepage-mockup-v2.html`
**Goal:** Redesign the Pardes Day School homepage from a 9-10 section scroll-heavy page into a clean, Apple-inspired 7-section storytelling page. The school is full. This is a brand showcase, not an admissions funnel.

## Design Decisions (Owner-Approved)

### Hero (85vh desktop, 65vh mobile)
- Full-bleed photo with warm green-tinted overlay
- Headline: "The school you *wish* you had growing up." (keep existing)
- "*wish*" in soft green (#7ecc9f), italic
- No buttons, no CTAs, no "scroll to explore"
- Subtle Ken Burns slow-zoom animation on the background image
- Future: swap photo for 15-second video loop when available

### Header
- Frosted glass effect (backdrop-filter blur)
- CTA button: "Meet the Team" (not "Schedule a Tour")
- Shrinks on scroll
- Mobile: hide nav links and CTA, show only brand logo

### Proof Bar
- 4 stats: 15+ Years, 220+ Students, 2+ Teachers Per Classroom, Pre-K-8
- 2x2 grid on mobile, 4-column on desktop
- Note: "2+" teachers, not "3-4" (not every class has that many)

### The Pardes Way (3 Pillars)
Condensed from 5 blocks to 3. Each pillar has: image, heading, two paragraphs with green bold highlights on key phrases, and a green-bar quote callout.

**Pillar 1: "Multiple Teachers. Precision Academics."**
- Merges the old "Multiple Teachers" and "Precision Academics" pillars
- Key highlights: "Multiple teachers work with students simultaneously", "NWEA MAP Growth data"
- Quote: "Every child gets direct instruction, every day."

**Pillar 2: "Practical Jewish Living."**
- Key highlights: "Chumash and Kriah", "Shabbat assembly"
- Quote: "Judaism isn't a subject here. It's how we live."

**Pillar 3: "Built for Life, Not Just School."**
- Merges "Practice Where It Counts" and "Built for Life" pillars
- Leads with LeHashlim/real-life skills (the wow factor), homework/practice second
- Key highlights: "LeHashlim program", "practice time is built into the school day"
- Quote: "Families get their evenings back."

Layout: alternating image/text sides. Only the middle pillar (Practical Jewish Living) gets sage background. Others are white.

### Divisions (3 Cards)
- Heading: "One school. / Three divisions. / One philosophy." (each on its own line)
- Three cards: Preschool (Gan Katan), Elementary, Middle School
- Cards have hover lift animation, staggered reveal on scroll
- Single column on mobile

### Student Life (Photo Gallery)
- 4 photos in staggered grid (alternating vertical offset on desktop)
- 2x2 on mobile, no offset
- Heading: "This is what a day at Pardes looks like."

### FAQ (3 Questions)
- Accordion-style (HTML `<details>` elements)
- Questions sourced from real site data:
  1. "What makes The Pardes Way different from other schools?"
  2. "Do you offer financial aid or scholarships?"
  3. "How does the admissions process work?"
- "See all frequently asked questions" link to full FAQ page

### Soft CTA
- Dark forest green background
- "Want to see it for yourself?"
- "Come walk our classrooms. / Meet our teachers. / See The Pardes Way in action." (each on its own line)
- Button: "Get in Touch" (not "Meet the Team" or "Schedule a Tour")

### Footer
- Dark background, 4-column grid (2-column on mobile)
- Both campus addresses, phone, email, quick links, divisions, Instagram

## Sections Removed from Homepage
- Origin story (moved to About page)
- Donation CTA (moved to Support page)
- Student Life full gallery (condensed to 4 photos)
- Full admissions steps (stays on Admissions page)
- Testimonials (removed until real quotes available)

## Typography
- Montserrat for all headings and body text
- Caveat (handwritten) used ONLY for section labels ("The Pardes Way", "Our Divisions", "Student Life", "Common Questions") - max 1 per section
- No em dashes anywhere. Use periods or commas instead.
- Body text minimum 16px, minimum color #424245
- Green bold (`<strong>`) for inline highlights instead of pill tags

## Color Usage
- White background for most sections
- Sage (#f0f4ee) for ONE pillar only (Practical Jewish Living)
- Forest green (#10653c) for CTA buttons, section labels, highlights
- Dark forest (#0a4a2b) for CTA band background
- Navy (#343e85) for brand logo

## Spacing (Desktop / Mobile)
- Hero: 85vh / 65vh
- Proof bar: 72px / 48px
- Pardes Way intro: 80px top, 48px bottom / 56px top, 24px bottom
- Pillars: 72px / 48px
- Divisions: 64px / 56px
- Student Life: 80px / 56px
- FAQ: 80px / 56px
- CTA: 80px / 64px

## Copy Rules
- Headlines should not have orphaned words on their own line
- Each sentence in a multi-line CTA goes on its own line
- No cliche descriptors under the hero. Let the headline breathe.
- Button labels must match what happens when clicked

## Implementation Notes
- The mockup is a standalone HTML file. Implementation means translating these styles and structure into the existing `index.html` which uses the site's JS bundle (`main-cpapzbpt.js`).
- Keep the existing image manifest system (`data/image-manifest.json`) for dynamic image loading.
- The existing FAQ data is in `data/faq.json` with `showOnHomepage: true` flags.
- Viewport meta tag must be present: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Run `node scripts/validate.js` before pushing to verify no broken asset refs.
