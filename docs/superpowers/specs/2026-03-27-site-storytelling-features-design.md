# Pardes Website — Storytelling & Interactive Features

**Date**: 2026-03-27
**Status**: Draft
**Owner**: Levi Druin

## Problem

The Pardes website currently functions as a static brochure. It communicates what the school is, but not what it feels like. Prospective families can't sense the life of the school. Current families have no reason to visit. The site doesn't tell a story — it lists facts.

## Design Principle

**Nothing goes stale.** Every feature must look great whether updated weekly or monthly. No dates, no "latest" labels, no timestamps that broadcast inactivity. Content is evergreen by default and gets *better* with updates rather than *worse* without them.

## Architecture Notes

- **Static site on GitHub Pages** — no server, no build step, no directory listing API
- **All data comes from JSON files** read by standalone JS files in `js/`
- **New pages get new standalone JS files** in `js/` (e.g., `js/gallery.js`, `js/newsletter.js`). The minified bundle (`main-cpapzbpt.js`) is not modified.
- **Image lazy loading** uses `js/image-preload.js` (IntersectionObserver with 300px rootMargin), already loaded on all pages
- **Nav is a `<site-header>` web component** defined in `js/site-shell.js`, loaded via the bundle. Nav items are defined in each page's HTML. Every HTML page must be updated when nav items change.
- **Lightbox**: The existing `js/staff-lightbox.js` is purpose-built for staff cards. Gallery and newsletter lightboxes will be new standalone JS files (`js/gallery-lightbox.js`, `js/newsletter-viewer.js`) following the same pattern — no third-party libraries.

## Features

### 1. Gallery Page (New Page: `pages/gallery.html`)

**Purpose**: A dedicated "Pardes Moments" page where prospective and current families can browse the visual life of the school.

**What it contains**:
- A masonry-style or grid photo stream showing school life — classrooms, events, celebrations, everyday moments
- No dates or timestamps on photos. Labeled by category/event name only (e.g., "Chanukah Carnival," "Classroom Life," "Graduation 2025")
- Video embeds mixed into the gallery as Levi creates them over time
- Photos are batch-uploaded to `assets/images/gallery/`. The page reads from `data/gallery.json` — a JSON manifest (no directory scanning, which is impossible on a static host)

**Navigation**: Top-level nav item — "Gallery", placed after "Student Life" and before "Parents" in the nav order

**Content management**: Drop images into `assets/images/gallery/`, add entries to `data/gallery.json`. No CMS, no dates.

**JS file**: `js/gallery.js` — reads `data/gallery.json`, renders the grid, handles category filtering and lightbox triggers

**Design notes**:
- Filterable by category tags (optional, can add later)
- Lightbox on click for full-size viewing (new `js/gallery-lightbox.js`)
- Lazy-loaded with `js/image-preload.js` (already on all pages)
- Responsive: 3 columns desktop, 2 tablet, 1 mobile

**Example `data/gallery.json`**:
```json
{
  "items": [
    {
      "type": "photo",
      "src": "assets/images/gallery/chanukah-carnival-01.jpg",
      "caption": "Lighting the menorah together",
      "category": "Chanukah Carnival",
      "alt": "Students and teachers lighting a large menorah at the Chanukah carnival"
    },
    {
      "type": "photo",
      "src": "assets/images/gallery/classroom-reading.jpg",
      "caption": "",
      "category": "Classroom Life",
      "alt": "Third graders reading together on the classroom rug"
    },
    {
      "type": "video",
      "embed_url": "https://www.youtube-nocookie.com/embed/XXXXX",
      "caption": "A day at Pardes",
      "category": "Campus Life",
      "thumbnail": "assets/images/gallery/video-thumb-day-at-pardes.jpg"
    }
  ]
}
```

**Field reference**:
- `type` (required): `"photo"` or `"video"`
- `src` (required for photos): path to image file
- `embed_url` (required for videos): YouTube/Vimeo privacy-enhanced embed URL
- `thumbnail` (required for videos): poster image path
- `caption` (optional): short text shown below image in lightbox
- `category` (optional): grouping label, used for filtering
- `alt` (required for photos): accessible alt text

### 2. Newsletter Page (New Page: `pages/newsletter.html`)

**Purpose**: An archive of Canva weekly newsletters so parents and prospective families can see the school is active and communicating.

**What it contains**:
- A visual wall of newsletter cards — each card shows the first page of a Canva newsletter as a thumbnail image
- Clicking a card opens a viewer modal showing all exported pages in a vertical scroll
- No dates displayed on the cards. Ordered newest-first (by array position in JSON) but without timestamps
- Each newsletter is a set of exported page images from Canva (variable count — typically 6 but could be 4 or 8)

**Navigation**: Top-level nav item — "Newsletter", placed after "Gallery" in the nav order

**Content management**: Export pages from Canva as images → drop into `assets/images/newsletters/issue-XX/` folder → add entry to `data/newsletters.json`.

**JS file**: `js/newsletter.js` — reads `data/newsletters.json`, renders the card grid, opens the viewer modal on click

**Design notes**:
- Cards show page 1 (first item in `pages` array) as cover thumbnail
- Viewer modal shows all pages in a vertical scrollable view inside a white card (similar to staff lightbox pattern)
- Even with just 3-4 newsletters, the wall looks intentional. With 20+, it looks impressive
- Responsive grid: 3 columns desktop, 2 tablet, 1 mobile

**Example `data/newsletters.json`**:
```json
{
  "issues": [
    {
      "title": "Parshat Vayikra",
      "description": "",
      "pages": [
        "assets/images/newsletters/issue-01/page-1.jpg",
        "assets/images/newsletters/issue-01/page-2.jpg",
        "assets/images/newsletters/issue-01/page-3.jpg",
        "assets/images/newsletters/issue-01/page-4.jpg",
        "assets/images/newsletters/issue-01/page-5.jpg",
        "assets/images/newsletters/issue-01/page-6.jpg"
      ]
    }
  ]
}
```

**Field reference**:
- `title` (required): display name for the newsletter card
- `description` (optional): short subtitle text
- `pages` (required): array of image paths, variable length. First item used as cover thumbnail.

### 3. School Calendar

**Purpose**: Help current parents find key dates — holidays, early dismissals, school events — without calling the office.

**What it contains**:
- A clean styled date list showing school dates only
- Holidays, early dismissals, no-school days, key events (picture day, conferences, graduation)
- **No addresses or campus locations** displayed (security concern)
- Lives on the **Parents page** as a prominent section, not a separate page

**Content management**: A `data/calendar.json` file with date entries. Updated at the start of each semester (2-3 times per year).

**JS file**: Logic added to existing page script or a small `js/calendar.js` that reads `data/calendar.json` and renders the list grouped by month.

**Design notes**:
- **List view** (not month-grid) — easier to maintain, works better on mobile, no empty-day problem
- Grouped by month with clean typography
- Option to link to a downloadable PDF of the full school calendar

**Example `data/calendar.json`**:
```json
{
  "school_year": "2025-2026",
  "dates": [
    {
      "date": "2026-04-13",
      "end_date": null,
      "label": "Pesach Break Begins",
      "type": "no_school"
    },
    {
      "date": "2026-04-13",
      "end_date": "2026-04-21",
      "label": "Pesach Break",
      "type": "no_school"
    },
    {
      "date": "2026-05-01",
      "label": "Early Dismissal — Teacher In-Service",
      "type": "early_dismissal"
    },
    {
      "date": "2026-06-12",
      "label": "8th Grade Graduation",
      "type": "event"
    }
  ],
  "pdf_url": "assets/docs/school-calendar-2025-2026.pdf"
}
```

**Field reference**:
- `date` (required): ISO 8601 format `YYYY-MM-DD`
- `end_date` (optional): ISO 8601 `YYYY-MM-DD` for multi-day ranges (e.g., Pesach break). Null or omitted for single-day entries.
- `label` (required): display text for the date
- `type` (required): one of `"holiday"`, `"no_school"`, `"early_dismissal"`, `"event"` — used for color-coding or icons
- `pdf_url` (optional, top-level): link to downloadable calendar PDF

### 4. Staff Bios (Enhanced Lightbox)

**Purpose**: When a parent clicks a staff member, they should feel like they're meeting a person, not reading a database entry.

**Current state**: The lightbox exists (`js/staff-lightbox.js`) and shows photo, name, and role. It needs richer content.

**Data approach**: Add `bio` and `standout` fields directly to `data/staff-leadership.json` member objects (not a separate file). This avoids name-matching fragility and keeps all staff data in one place. The lightbox JS reads from the same data source.

**Updated `data/staff-leadership.json` schema**:
```json
{
  "members": [
    {
      "name": "Katy Horowitz",
      "title": "Head of School & Co-Founder",
      "initials": "KH",
      "email": "",
      "featured": true,
      "bio": "Katy co-founded Pardes with a vision of building a school where every child is known by name and nurtured as an individual. With over two decades in Jewish education, she leads with warmth, clarity, and an unwavering belief that children rise to the expectations set for them.",
      "standout": "Known for greeting every student by name at morning drop-off — rain or shine."
    }
  ]
}
```

**Field reference** (new fields):
- `bio` (optional): warm third-person paragraph about the staff member. If missing, lightbox shows photo + name + role only (current behavior).
- `standout` (optional): one memorable personal detail, displayed as a highlighted pull quote in the lightbox.

**Smart fillers**: For initial launch, bios are generated based on each person's role, division, and what we know about Pardes. These read as real and warm, not generic. Staff replace them with real answers over time.

**Design notes**:
- Lightbox inner card gets slightly larger to accommodate the bio text
- Standout detail styled as a pull quote or highlighted card within the lightbox
- `js/staff-lightbox.js` is updated to read `bio` and `standout` from the data

### 5. Testimonials (Scattered Across Site)

**Purpose**: Real parent voices placed where they're most persuasive, not quarantined on one page.

**Two formats**:

**A. Pull Quotes** (lightweight, used on most pages):
- A single powerful sentence in large italic text
- Parent name and "since [year]" below
- Appears between content sections as a visual breather
- Pages: About, Preschool, Elementary, Middle School, Student Life

**B. Family Story Cards** (rich, used on Admissions):
- Small card with family photo (or placeholder silhouette), family name, and 2-3 sentence story
- Placed prominently on the Admissions page where prospective parents are deciding
- 3-4 story cards in a grid

**Data approach**: Modify existing `data/testimonials.json`. Existing fields (`quote`, `name`, `detail`, `initials`) are kept for backwards compatibility. New fields are added. Existing entries default to `type: "quote"`.

**Updated `data/testimonials.json` schema**:
```json
{
  "_note": "Placeholder testimonials. Replace with real parent quotes once collected.",
  "testimonials": [
    {
      "quote": "We came for Gan Katan and never left. Our three kids have grown up here.",
      "name": "The Cohen Family",
      "detail": "Parents of three Pardes students",
      "initials": "CF",
      "type": "quote",
      "pages": ["about", "preschool"],
      "since_year": 2019
    },
    {
      "quote": "Our daughter started barely speaking English. By first grade she was reading in two languages.",
      "story": "We moved to Miami from Brazil and were nervous about the transition. From day one, the Gan Katan teachers made our daughter feel safe and special. By first grade she was reading in both English and Hebrew. Now in third grade, she's the one helping new students feel welcome.",
      "name": "The Silva Family",
      "detail": "Gan Katan through Elementary",
      "initials": "SF",
      "type": "story",
      "pages": ["admissions"],
      "family_photo": "assets/images/families/silva-family.jpg",
      "since_year": 2021
    }
  ]
}
```

**Field reference**:
- `quote` (required): short pull-quote text (used for both types)
- `name` (required): family or parent name
- `detail` (required): context line (e.g., "Parent of a 2nd grader")
- `initials` (required): initials for placeholder avatar when no photo
- `type` (optional, default `"quote"`): `"quote"` for pull quotes, `"story"` for family story cards
- `pages` (optional, default `[]`): array of page slugs where this testimonial appears. Empty = not displayed anywhere (stockpiled for later use)
- `story` (optional, story type only): longer 2-3 sentence narrative for story cards
- `family_photo` (optional, story type only): path to family image. Falls back to initials avatar.
- `since_year` (optional): year family joined Pardes, shown as "since 2019"

**Design notes**:
- Pull quotes use the existing section rhythm — sage/white alternating backgrounds
- Story cards on Admissions get their own section with a "What Parents Say" heading
- Testimonials are rendered by a small `js/testimonials.js` that reads the JSON and injects into pages based on `pages` field
- Placeholder testimonials written for launch, replaced as real ones come in

### 6. Video Integration

**Purpose**: Video builds trust faster than text. Even short clips make the school feel real.

**Where it appears**:
- Gallery page: mixed into the photo grid as `type: "video"` entries in `data/gallery.json`
- Division pages (preschool, elementary, middle school): optional video embed per division as content is created

**Implementation**:
- YouTube or Vimeo embeds (privacy-enhanced mode: `youtube-nocookie.com`)
- Lazy-loaded iframes (load on click or IntersectionObserver)
- Placeholder state: video entries simply don't appear when `data/gallery.json` has no video items. No empty states, no "coming soon."

**Content management**: Videos added as entries in `data/gallery.json` with `type: "video"` (see Gallery section for schema).

## Nav Changes

Two new top-level items added to the nav in this order:

`About | Admissions | Preschool | Elementary | Middle School | Student Life | **Gallery** | **Newsletter** | Parents | Support | Contact | Staff | FAQ`

Since every page has its own nav HTML, all 11 existing pages plus the 2 new pages (13 total) must be updated.

## Pages Affected

| Page | Changes |
|------|---------|
| **Gallery** (new) | Photo stream + video embeds |
| **Newsletter** (new) | Canva newsletter archive wall |
| **Staff** | Enhanced lightbox with bios + standout details |
| **Parents** | School calendar section added |
| **Admissions** | Family story cards (testimonials) |
| **About** | 1-2 pull quote testimonials between sections |
| **Preschool** | 1 pull quote testimonial |
| **Elementary** | 1 pull quote testimonial |
| **Middle School** | 1 pull quote testimonial |
| **Student Life** | 1-2 pull quote testimonials |
| **All 13 pages** | Nav updated with Gallery + Newsletter links |

## Data Files (New or Modified)

| File | Status | Purpose |
|------|--------|---------|
| `data/gallery.json` | New | Photo + video manifest with categories, captions, alt text |
| `data/newsletters.json` | New | Newsletter entries with title, variable-length page image arrays |
| `data/calendar.json` | New | School dates in ISO 8601 format: holidays, dismissals, events (no locations) |
| `data/staff-leadership.json` | Modified | Add `bio` and `standout` fields to existing member objects |
| `data/testimonials.json` | Modified | Add `type`, `pages`, `story`, `family_photo`, `since_year` fields; keep existing fields |

## JS Files (New or Modified)

| File | Status | Purpose |
|------|--------|---------|
| `js/gallery.js` | New | Reads gallery.json, renders grid, handles filtering |
| `js/gallery-lightbox.js` | New | Full-size photo viewer for gallery items |
| `js/newsletter.js` | New | Reads newsletters.json, renders card wall |
| `js/newsletter-viewer.js` | New | Scrollable multi-page newsletter viewer modal |
| `js/calendar.js` | New | Reads calendar.json, renders date list grouped by month |
| `js/testimonials.js` | New | Reads testimonials.json, injects quotes/stories into pages by slug |
| `js/staff-lightbox.js` | Modified | Read `bio` and `standout` from staff data, render in lightbox |

## Asset Directories (New)

| Directory | Purpose |
|-----------|---------|
| `assets/images/gallery/` | Photo stream images |
| `assets/images/newsletters/` | Canva exports, one subfolder per issue (e.g., `issue-01/`) |
| `assets/images/families/` | Family photos for testimonial story cards |

## Post-Implementation

- **Update CLAUDE.md**: Add new pages to directory structure, new data files to table, new JS files, new asset directories, and change log entry
- **Update `data/image-manifest.json`**: Add gallery images to the manifest if needed for the bundle's image system
- **Run `node scripts/validate.js`**: Verify no broken asset references

## What This Does NOT Include

- **Live event calendar with locations** — excluded for security (no outsiders knowing where students are)
- **Blog or dated news feed** — violates the "nothing goes stale" principle
- **CMS or admin panel changes** — all content managed via JSON files and image folders
- **Social media integration** — can be added later but not in this phase
- **Online forms beyond existing** — contact and admissions forms already work via Formspree

## Success Criteria

1. A prospective parent browsing the site for 5 minutes should feel like they know what a day at Pardes looks like
2. A current parent should be able to find the school calendar and latest newsletter in under 10 seconds
3. No page on the site should ever look "abandoned" or "last updated 3 months ago"
4. Staff members feel represented — bios are warm and accurate to their role even before personalization
5. The site tells a story, not just lists information
