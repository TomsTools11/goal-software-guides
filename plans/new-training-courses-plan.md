# Plan: Add Three New Training Courses

## Context

Three new sales training outlines have been added to the project root. These need to be turned into full interactive training courses on the GOAL Software Guides platform, following the exact same patterns as existing SOPs (e.g., `sales-demo-sop`, `client-onboarding-sop`).

**Source files:**
- `/GOAL Sales Discovery Process.md` (7 modules — consultative discovery framework)
- `/GOAL Sales Training - Setting Firm Expectations & Handling Objections - Outline.md` (5 parts — expectations & objection handling)
- `/GOAL Competition Research.md` (6 sections — market overview, GOAL positioning, competitor profiles, battlecards, key takeaways)

---

## Files to Modify

### 1. `src/lib/guides.ts` — Add three metadata entries

```typescript
{
  slug: 'sales-discovery-process',
  title: 'GOAL Sales Discovery Process',
  description: 'Master consultative discovery for insurance sales — scorecard framework, qualification, deep problem exploration, and demo transition techniques.',
  icon: '',
  chapters: 9,
  estimatedTime: '35 min',
  difficulty: 'Intermediate' as const,
  tags: ['Sales', 'Discovery', 'Qualification'],
  category: 'sop' as const,
}

{
  slug: 'setting-expectations-sop',
  title: 'Setting Firm Expectations & Handling Objections',
  description: 'Build confidence handling the data requirement, 90-day ramp conversation, and the "burned by lead vendors" objection — with case studies and talk tracks.',
  icon: '',
  chapters: 8,
  estimatedTime: '30 min',
  difficulty: 'Intermediate' as const,
  tags: ['Sales', 'Objections', 'Expectations'],
  category: 'sop' as const,
}

{
  slug: 'competition-research',
  title: 'GOAL Competition Research',
  description: 'Know the competitive landscape — market positioning, competitor strengths and weaknesses, battlecards, objection handling, and landmine questions for every major competitor.',
  icon: '',
  chapters: 8,
  estimatedTime: '25 min',
  difficulty: 'Beginner' as const,
  tags: ['Sales', 'Competition', 'Battlecards'],
  category: 'sop' as const,
}
```

### 2. `src/components/dashboard/guideIcons.tsx` — Add three icon entries

All use `bg="#0F4C35"` (GOAL green, matching all existing SOPs):
- `sales-discovery-process` — magnifying glass icon (discovery theme)
- `setting-expectations-sop` — shield-checkmark icon (firm expectations theme)
- `competition-research` — trophy/target icon (competitive positioning theme)

---

## Files to Create

### 3. `src/content/sales-discovery-process/index.mdx`

**9 H2 sections** (must match `chapters: 9` in metadata):

| Section | Key Components |
|---------|---------------|
| `## Overview & Core Principle` | TipCallout (info), InfoCard |
| `## Module 1: Sales Scorecard & Evaluation Framework` | InfoCards (scorecard phases), Quiz, ChecklistItem |
| `## Module 2: Opening & Framing the Call` | CopyableTemplate (agenda script), Accordion (catalyst triggers), Quiz, ChecklistItem |
| `## Module 3: Initial Discovery & Strategic Qualification` | StepByStep (4 steps), DataTable (CRM signals), CopyableTemplate (question bank), Quiz, ChecklistItem |
| `## Module 4: Strategic Disqualification` | StepByStep (4-step DQ framework), CopyableTemplate (DQ talk track), Accordions (role-play scenarios), ChecklistItem |
| `## Module 5: Deep Problem Exploration` | InfoCards (operational/financial/strategic), CopyableTemplate (financial worksheet), TipCallout (Gap Bridge script), Quiz, ChecklistItem |
| `## Module 6: Conversational Skills & Call Control` | InfoCards (listening/control/pauses), StepByStep (3 drills), Quiz, ChecklistItem |
| `## Module 7: Transitioning to the Demo` | CopyableTemplate (transition statement), TipCallout (key principle), Quiz, ChecklistItem |
| `## Practice Scenarios & Role-Play Reference` | Accordions (3 scenarios + scorecard checklist), ChecklistItem |

**ID prefixes:** ChecklistItems use `sdp-*`, Quizzes use `sdp-*` (globally unique, no conflicts with existing `demo-`, `close-`, `post-`, `asset-`, `onboard-`, `qc-`, `filter-` prefixes).

### 4. `src/content/setting-expectations-sop/index.mdx`

**8 H2 sections** (must match `chapters: 8` in metadata):

| Section | Key Components |
|---------|---------------|
| `## Pre-Training Context` | TipCallout (purpose), InfoCards (why it exists, 3 situations covered) |
| `## Part 1: The Data Requirement` | StepByStep (how to introduce), CopyableTemplate (talk track), Accordions (pushback responses), Quiz, ChecklistItem |
| `## Part 2: The 90-Day Ramp Conversation` | DataTable (3-phase timeline), CopyableTemplate (talk track), Accordion (objection handling), Quiz, ChecklistItem |
| `## Part 3: Handling the "Burned by Lead Vendors" Objection` | StepByStep (5-step response), CopyableTemplate (talk track), Accordions (case study, skepticism handling), Quiz, ChecklistItem |
| `## Part 4: Interactive Exercises` | Accordions (3 exercises), Quiz (multi-question), ChecklistItems (x3) |
| `## Part 5: Key Takeaways` | InfoCards (3 summaries), TipCallout (commitment), ChecklistItem |
| `## Talk Track Reference Library` | CopyableTemplates (3 condensed quick-reference versions) |
| `## Objection Quick-Reference` | DataTable (objection matrix) |

**ID prefixes:** ChecklistItems use `sep-*`, Quizzes use `sep-*`.

### 5. `src/content/competition-research/index.mdx`

**8 H2 sections** (must match `chapters: 8` in metadata):

| Section | Key Components |
|---------|---------------|
| `## Market Overview & How the Industry Works` | TipCallout (info — why reps need to know this), DataTable (5 market segments: aggregators, exchanges, self-serve, live transfer, GOAL), InfoCard (where GOAL fits — "the only non-middleman") |
| `## GOAL Platform Positioning` | DataTable (key differentiators table — 8 rows from source), DataTable ("Old Way vs. GOAL Way" comparison), TipCallout (important — the core narrative: agents own their leads), ChecklistItem |
| `## Competitor Profile: EverQuote` | InfoCard (company snapshot), DataTable (strengths/weaknesses), Accordion (detailed analysis), ChecklistItem |
| `## Competitor Profile: MediaAlpha` | InfoCard (company snapshot + FTC settlement callout), DataTable (strengths/weaknesses), TipCallout (warning — FTC compliance issue), Accordion (detailed analysis), ChecklistItem |
| `## Competitor Profiles: NextGen, QuoteWizard & SmartFinancial` | InfoCards (3 company snapshots), DataTables (strengths/weaknesses for each), Accordions (detailed analysis for each), ChecklistItem |
| `## Competitive Battlecards` | Accordions (5 battlecards — one per competitor, each containing: quick overview, their pitch, GOAL differentiators, objection handling table, landmines to set, win/loss themes), CopyableTemplates (objection responses for each competitor), Quiz, ChecklistItem |
| `## Messaging & Positioning Strategy` | DataTable (messaging matrix — 6 dimensions across all 5 competitors + GOAL), TipCallout (important — positioning map insight: GOAL is alone in "high control + exclusive leads" quadrant), InfoCard (when to position against each competitor — 5 scenario summaries) |
| `## Key Takeaways & Conversation Starters` | TipCallout (important — "The One Thing": every competitor is a middleman, GOAL is not), DataTable (3 pillars: exclusivity, brand ownership, cost control), CopyableTemplate (universal landmine questions — 5 questions to use in every conversation), Quiz (final knowledge check), ChecklistItem |

**ID prefixes:** ChecklistItems use `cr-*`, Quizzes use `cr-*`.

**Content notes for Course 3:**
- The 5 competitor battlecards are the richest section — each should be a full Accordion with the competitor's pitch, GOAL differentiators, an objection-handling DataTable, landmine questions as a bulleted list, and win/loss themes
- CopyableTemplates for objection responses allow reps to copy talk tracks directly
- The "Old Way vs. GOAL Way" and messaging matrix tables translate directly from the source into DataTable components
- EverQuote and MediaAlpha get their own sections due to their market prominence; NextGen, QuoteWizard, and SmartFinancial are grouped into one section to keep the course scannable

---

## Implementation Sequence

1. Add all three entries to `src/lib/guides.ts` (append to `guides` array)
2. Add all three icon entries to `src/components/dashboard/guideIcons.tsx`
3. Create `src/content/sales-discovery-process/index.mdx` with full MDX content from outline
4. Create `src/content/setting-expectations-sop/index.mdx` with full MDX content from outline
5. Create `src/content/competition-research/index.mdx` with full MDX content from outline

No other files need changes — routing (`[slug]/page.tsx`), sidebar (`AppSidebar`), and dashboard (`CourseGrid`) all read from the `guides` array automatically.

---

## Reference Files (existing patterns to follow)

- `src/content/sales-demo-sop/index.mdx` — closest analog for Course 1 structure
- `src/content/client-onboarding-sop/index.mdx` — closest analog for Course 2 tone
- `src/components/mdx/MDXComponents.tsx` — all available component props
- `src/hooks/useProgressTracker.ts` — confirms H2 count must match `chapters`

---

## Verification

1. Run `npm run build` — confirm no build errors, all three slugs generate static pages
2. Visit `/guides/sales-discovery-process`, `/guides/setting-expectations-sop`, and `/guides/competition-research` — verify content renders
3. Confirm dashboard shows all three new courses under the "SOPs" tab with correct icons
4. Scroll through each course — verify progress bar updates as H2 sections come into view
5. Test all Quiz and ChecklistItem interactions — verify localStorage persistence
6. Confirm sidebar lists all three new entries under SOPs section
