# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 10-section homepage with a streamlined 7-section Apple-inspired design per the approved mockup and spec.

**Architecture:** The site is static HTML/CSS/JS on GitHub Pages. All redesign styles go in a new `css/homepage-redesign.css` file that overrides the existing minified bundle classes. The HTML in `index.html` gets restructured: sections removed (origin story, donation CTA, testimonials, admissions steps), pillars condensed from 5 to 3 with new copy, divisions changed to card grid, FAQ trimmed to 3 questions, header CTA changed, and a new soft CTA section added before the footer.

**Tech Stack:** HTML, CSS, static site on GitHub Pages. No build step.

**Spec:** `docs/superpowers/specs/2026-03-23-homepage-redesign-design.md`
**Mockup:** `.superpowers/brainstorm/15431-1774271341/homepage-mockup-v2.html`

**Prerequisites:**
- The existing JS bundle (`main-cpapzbpt.js`) handles header scroll-shrink, mobile nav toggle, and `[data-reveal]` animations. These do NOT need reimplementation.
- Line numbers in tasks are approximate. Identify sections by their HTML comments and class names, not line numbers.
- All section labels (`<span class="section-label">`) MUST use the `section-label` class to pick up the Caveat handwritten font.
- Pull from origin before starting: `git pull origin main`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `css/homepage-redesign.css` | CREATE | All new homepage styles (overrides minified bundle) |
| `index.html` | MODIFY | Restructure all homepage sections |
| `data/faq.json` | READ ONLY | Source FAQ content (already has `showOnHomepage` flags) |

---

### Task 1: Create the homepage redesign CSS file

**Files:**
- Create: `css/homepage-redesign.css`
- Modify: `index.html` (add stylesheet link in `<head>`)

- [ ] **Step 1: Create `css/homepage-redesign.css`**

Copy all styles from the mockup file `.superpowers/brainstorm/15431-1774271341/homepage-mockup-v2.html` into `css/homepage-redesign.css`. This includes:
- Hero styles (85vh, Ken Burns, warm overlay)
- Proof bar styles
- Pardes Way / pillar styles (including `pillar-highlight`, green bold `strong`)
- Division card grid styles
- Student life photo grid
- FAQ accordion styles (using `<details>` element)
- Soft CTA section styles
- All responsive breakpoints (1024px tablet, 768px mobile)

Important adaptations from mockup to production:
- Use existing class names where they match (`.hero-immersive`, `.proof-bar`, `.site-header`, `.site-footer`)
- Add new classes only where needed (`.pillar-highlight`, `.faq-section`, `.soft-cta`, `.photo-grid`)
- The mockup uses Google Fonts links for Montserrat and Caveat. The production site already loads Montserrat via the CSS bundle. Add only the Caveat font import.

- [ ] **Step 2: Add the stylesheet link to `index.html`**

In `index.html`, add after the existing CSS links (after line 55):
```html
<link rel="stylesheet" href="css/homepage-redesign.css">
```

Also add Caveat font in `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Commit**

```bash
git add css/homepage-redesign.css index.html
git commit -m "feat: add homepage redesign stylesheet and font import"
```

---

### Task 2: Redesign the hero section

**Files:**
- Modify: `index.html` (lines 105-121)

- [ ] **Step 1: Replace the hero HTML**

Replace the current hero section (lines 106-121) with:
```html
<section class="hero-immersive">
  <div class="hero-immersive__bg hero-bg-redesign"></div>
  <div class="hero-immersive__overlay hero-overlay-redesign"></div>
  <div class="hero-immersive__content container">
    <h1>The school you <span class="hero-wish">wish</span> you had growing up.</h1>
  </div>
</section>
```

Key changes:
- Remove the carousel (`data-hero-carousel`, `data-hero-track`, `data-hero-dots`)
- Remove "Scroll to explore" hint
- Remove tagline (just the headline, let it breathe)
- Add new classes for Ken Burns animation and warm overlay
- Single static background image (set via CSS)

- [ ] **Step 2: Update header CTA**

On line 99, change:
```html
<a class="btn btn-primary" href="pages/admissions.html#schedule-tour">Schedule a Tour</a>
```
to:
```html
<a class="btn btn-primary" href="pages/staff.html">Meet the Team</a>
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:50127/index.html` and confirm:
- Hero shows single image with Ken Burns zoom
- No carousel dots or arrows
- No "Scroll to explore"
- Header says "Meet the Team"
- Hero is 85vh on desktop, 65vh on mobile

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: redesign hero - single image, Ken Burns, remove carousel and scroll hint"
```

---

### Task 3: Condense The Pardes Way from 5 pillars to 3

**Files:**
- Modify: `index.html` (lines 147-211)

- [ ] **Step 1: Replace the 5 pillar blocks with 3**

Replace the entire Pardes Way section content (the 5 `pillar-block` divs) with 3 new pillars. Each pillar uses green bold `<strong>` for key phrases and a `pillar-highlight` quote callout.

**Pillar 1: Multiple Teachers. Precision Academics.** (merges old pillars 1+2)
- Image: `assets/images/elementary/20251209_111346.jpg`
- Green bold: "Multiple teachers work with students simultaneously", "NWEA MAP Growth data"
- Quote: "Every child gets direct instruction, every day."

**Pillar 2: Practical Jewish Living.** (reversed layout, sage background)
- Image: `assets/images/elementary/pxl_20251204_173347433.jpg`
- Green bold: "Chumash and Kriah", "Shabbat assembly"
- Quote: "Judaism isn't a subject here. It's how we live."

**Pillar 3: Built for Life, Not Just School.** (merges old pillars 4+5)
- Image: `assets/images/elementary/img_0561.jpg`
- Green bold: "LeHashlim program", "practice time is built into the school day"
- Quote: "Families get their evenings back."

Copy exact HTML structure and copy from the mockup file. Use existing `pillar-block` classes where possible, add new ones from `homepage-redesign.css`.

- [ ] **Step 2: Verify in browser**

Confirm:
- Only 3 pillars visible
- Green bold highlights render correctly
- Green-bar quote callouts appear
- Middle pillar has sage background
- Alternating image/text layout works

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: condense Pardes Way to 3 pillars with green highlights and quote callouts"
```

---

### Task 4: Redesign the divisions section

**Files:**
- Modify: `index.html` (lines 213-247)

- [ ] **Step 1: Replace divisions HTML**

Replace the current horizontal division cards with a 3-column card grid matching the mockup. Each card has:
- Image (aspect-ratio 16/10)
- Age range in green uppercase
- Division name as h3
- One-line description
- Hover lift animation

Change heading to use line breaks:
```html
<h2 id="divisions-heading">One school.<br>Three divisions.<br>One philosophy.</h2>
```

Remove the "Explore [Division]" buttons (they were flagged as dead-end interactions).

- [ ] **Step 2: Verify in browser**

Confirm:
- 3 cards in a row on desktop
- Single column on mobile
- Heading breaks across 3 lines
- Hover lift works
- No "Explore" buttons

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: redesign divisions as card grid, fix heading line breaks, remove dead-end buttons"
```

---

### Task 5: Remove sections that don't belong on homepage

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Remove the following sections entirely**

Delete these sections from `index.html`:
1. **Admissions Steps** (lines 273-308) - stays on admissions page
2. **Testimonials** (lines 310-355) - removed until real quotes available
3. **Origin Story** (lines 417-435) - moved to about page
4. **Donation CTA** (lines 437-464) - moved to support page

- [ ] **Step 2: Verify in browser**

Confirm only these sections remain:
1. Hero
2. Proof bar
3. The Pardes Way (3 pillars)
4. Divisions (3 cards)
5. Student Life
6. FAQ
7. Footer

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: remove admissions steps, testimonials, origin story, and donation CTA from homepage"
```

---

### Task 6: Trim FAQ to 3 questions and convert to accordion

**Files:**
- Modify: `index.html` (FAQ section)

- [ ] **Step 1: Replace FAQ section**

Keep only 3 FAQs (the story-telling ones):
1. "What makes The Pardes Way different from other schools?"
2. "Do you offer financial aid or scholarships?"
3. "How does the admissions process work?"

Remove:
- "What grades does Pardes Day School serve?" (covered by proof bar)
- "Do students have homework?" (covered by pillar 3)

Change heading from "Frequently asked questions." to "What parents ask us."

Convert from JS-powered `button.faq-toggle` to native HTML `<details>/<summary>` elements (styled in `homepage-redesign.css`). This removes dependency on JS for FAQ toggling.

- [ ] **Step 2: Verify in browser**

Confirm:
- 3 FAQs visible, expandable via click
- + icon toggles to - when open
- "See all frequently asked questions" link works

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: trim FAQ to 3 story-driven questions, convert to native details/summary"
```

---

### Task 7: Add soft CTA section before footer

**Files:**
- Modify: `index.html` (between FAQ and footer)

- [ ] **Step 1: Add the soft CTA HTML**

Insert between the FAQ section and `</main>`:
```html
<section class="soft-cta">
  <div class="container" data-reveal>
    <h2>Want to see it for yourself?</h2>
    <p>Come walk our classrooms.<br>Meet our teachers.<br>See The Pardes Way in action.</p>
    <a class="btn-cta-light" href="pages/contact.html">Get in Touch</a>
  </div>
</section>
```

- [ ] **Step 2: Verify in browser**

Confirm:
- Dark forest green background
- White text, each sentence on its own line
- "Get in Touch" button links to contact page
- Looks correct on mobile (tighter padding)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add soft CTA section with 'Get in Touch' before footer"
```

---

### Task 8: Student Life section cleanup

**Files:**
- Modify: `index.html` (student life section)

- [ ] **Step 1: Simplify student life to static photo grid**

Replace the JS-powered `gallery-shell` with a static 4-photo grid matching the mockup. Use `<div>` elements with background images and the `photo-grid` class from `homepage-redesign.css`.

Remove the "See More Student Life" button (unnecessary on homepage).

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: simplify student life to static 4-photo grid"
```

---

### Task 9: Final validation and push

**Files:**
- All modified files

- [ ] **Step 1: Run validation**

```bash
cd /Users/levidruin/pardes-website
node scripts/validate.js
```

Fix any broken asset refs or issues.

- [ ] **Step 2: Full browser check**

Test in browser at desktop (1440px) and mobile (375px):
- [ ] Hero loads with Ken Burns animation
- [ ] Proof bar shows 4 stats
- [ ] 3 pillars with green bold and quote callouts
- [ ] Division cards in grid
- [ ] Student life photo grid
- [ ] FAQ accordion works (3 questions)
- [ ] Soft CTA section
- [ ] Footer intact
- [ ] No broken images
- [ ] No console errors

- [ ] **Step 3: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix: final polish and validation fixes for homepage redesign"
```

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 5: Verify live site**

Check https://drlevidruin.github.io/pardes-website/ after GitHub Pages deploys (about 1 minute).
