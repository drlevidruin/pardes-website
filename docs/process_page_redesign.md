# Page Redesign Process (The Pardes Way)

Proven process used for the homepage redesign on 2026-03-23. Replicate for every page.

## The Process (7 Steps)

### Step 1: Review the audit/fix plan
Start with the merged fix plan (`pardes-website-fix-plan.md`) to understand what all 3 audits flagged for the page.

### Step 2: Brainstorm with visual mockup
Use `/superpowers:brainstorming` skill. Key principles:
- Ask ONE question at a time
- Owner makes ALL editorial decisions (which pillars to keep, what copy says, what CTA text)
- AI proposes options, owner picks
- Build a live HTML mockup served locally (`python3 -m http.server 50127`)
- Iterate the mockup until owner approves both desktop AND mobile

### Step 3: Owner reviews mockup on real devices
Check the mockup on actual phone (not just DevTools emulation). Fix issues found:
- Text readability over images (overlay darkness)
- White space between sections
- Font sizes on mobile
- Line breaks (no orphaned words in headings)

### Step 4: Write spec from approved mockup
Save to `docs/superpowers/specs/YYYY-MM-DD-<page>-design.md`
Document every design decision the owner made during brainstorming.

### Step 5: Write implementation plan
Save to `docs/superpowers/plans/YYYY-MM-DD-<page>.md`
Break into small committable tasks. Each task = one section of the page.

### Step 6: Execute with subagents
Use subagent-driven development. One agent implements all tasks with individual commits.

### Step 7: Push and fix on real device
Push to GitHub Pages. Owner checks on phone. Fix any issues (overlay, spacing, missing content).

## Key Design Rules (Owner Preferences)
- NO em dashes ever. Use periods or commas.
- Caveat handwritten font ONLY on section labels (max 1 per section)
- Green bold `<strong>` for inline highlights (NOT pill tags)
- No cliche descriptor lines under heroes
- Headlines: no orphaned words on their own line
- Each sentence in multi-line CTAs on its own line
- Button labels must match what happens when clicked
- "2+" teachers, never "3-4" (not every class has that many)
- School is FULL. Site is brand showcase, not admissions funnel.
- "Meet the Team" not "Schedule a Tour" in header
- "Get in Touch" not "Schedule a Tour" for bottom CTAs
- White space: keep it tight. Err on less padding, not more.
- Body text minimum 16px, minimum color #424245
- Mockup EVERYTHING before pushing to live site

## Technical Notes
- New CSS goes in separate files (e.g., `css/homepage-redesign.css`) that override the minified bundle
- The minified bundle (`main-b2rpzzoh.css`) has mobile breakpoints at 760px that WILL conflict. Use `!important` to override.
- Always add `<meta name="viewport">` for proper mobile rendering
- Run `node scripts/validate.js` before pushing
- Always `git pull origin main` before starting work
- Always `git push origin main` after commits
