# Plan: Add SOPs Section with 5 Standard Operating Procedures

## Context

The GOAL Software Guides site currently has 3 training guides (Notion, Claude Cowork, Close CRM) displayed in a flat grid on the landing page. The guide system has no concept of categories — all entries are treated identically.

The goal is to add a new **Standard Operating Procedures (SOPs)** section to the site, visually distinct from the training guides, with **5 SOPs** sourced from the Notion "GOAL Resources" database:

1. **Account Review SOP** — 4-phase account review cycle, KPIs, escalation protocol, key terminology
2. **Client Onboarding SOP** — 3-phase onboarding process (pre-onboarding → meeting → post-launch activation), lead handling expectations, critical success factors
3. **Campaign Optimization SOP** — 5-pillar optimization framework (data feedback loop, budget controls, targeting, bid modifiers, source attribution), CPH/CPA metrics, AI call scoring
4. **Right Pricing SOP** — 6-step bid management procedure using Periscope dashboard, base bid + source modifier strategy, CPA-first optimization
5. **GOAL Sales Demo SOP** — Full sales conversation structure (pre-call → discovery → demo → close), demo scorecard, financial terms, post-demo workflow

## Notion Source Pages

| SOP | Notion Page ID |
|---|---|
| Account Review SOP | `3122984e-bf93-8075-8198-cca543c2e605` |
| Client Onboarding SOP | `31166a31-6cf6-493e-97c7-456a4137e2b7` |
| Campaign Optimization SOP | `3122984e-bf93-814a-ab20-c8759f66e0e9` |
| Right Pricing SOP | `3122984e-bf93-80e0-a813-fbdb0f0488ad` |
| GOAL Sales Demo SOP | `dfcd0888-8e2d-4197-ae54-e09967eb9ca2` |

---

## Files to Modify

### 1. `src/lib/guides.ts` — Add `category` field + 5 SOP entries

- Add `category: 'guide' | 'sop'` to the `GuideMetadata` interface
- Add `category: 'guide'` to all 3 existing entries
- Add 5 new SOP entries with `category: 'sop'`:
  - `account-review-sop` — "Account Review SOP", 5 sections, ~15 min, Intermediate
  - `client-onboarding-sop` — "Client Onboarding SOP", 4 sections, ~20 min, Beginner
  - `campaign-optimization-sop` — "Campaign Optimization SOP", 8 sections, ~25 min, Advanced
  - `right-pricing-sop` — "Right Pricing SOP", 5 sections, ~15 min, Intermediate
  - `sales-demo-sop` — "GOAL Sales Demo SOP", 7 sections, ~20 min, Intermediate
- Add helper: `getGuidesByCategory(category)` that filters the array

### 2. `src/app/page.tsx` — Split landing page into two sections

- Import `getGuidesByCategory` instead of raw `guides` array
- Add SOP icons to the `guideIcons` lookup (each with forest green `#0F4C35` background):
  - `account-review-sop` — clipboard/checklist icon
  - `client-onboarding-sop` — rocket/launch icon
  - `campaign-optimization-sop` — chart-trending-up icon
  - `right-pricing-sop` — dollar/tag icon
  - `sales-demo-sop` — presentation/screen icon
- Update hero subtitle to mention SOPs alongside guides
- Replace the single flat grid with two labeled sections:
  - **"Software Guides"** — existing 3 guides, same card style
  - **"Standard Operating Procedures"** — SOP cards with visual differentiation (green left border accent, "View SOP" button label instead of "Start Guide")
- Each section gets a centered divider-style header with subtitle text

### 3. `src/content/account-review-sop/index.mdx` — New file (create)

Full SOP content adapted from the Notion "Account Review SOP" page:

| Section | Interactive Components Used |
|---|---|
| 1.0 Purpose | `TipCallout variant="info"` |
| 2.0 Scope | `TipCallout variant="warning"` for exclusions |
| 3.0 KPIs (CPA, CPL, Contact Rate, Quote Rate, Close Rate) | `InfoCard` for each KPI definition + `TipCallout variant="important"` for the funnel synthesis note |
| 4.0 Procedure (4 phases) | `StepByStep` with string content per phase |
| 5.0 Escalation Protocol | `Accordion` for 3 escalation levels + `TipCallout variant="warning"` |
| Key Terminology | `InfoCard` for each term |

### 4. `src/content/client-onboarding-sop/index.mdx` — New file (create)

Full SOP content adapted from the Notion "Client Onboarding SOP" page:

| Section | Interactive Components Used |
|---|---|
| Purpose + Scope + Ownership | `TipCallout variant="info"` for purpose, `InfoCard` for ownership roles |
| Standard Timeline | `TipCallout variant="warning"` for the 30-day calibration note |
| Onboarding Phases Overview | `StepByStep` with 3 phases as top-level steps |
| Phase 1: Pre-onboarding (4 sub-steps) | `ChecklistItem` for each prep task |
| Phase 2: Onboarding Meeting (8 agenda items) | `Accordion` per agenda section, `TipCallout variant="important"` for lead delivery and follow-up non-negotiables, `InfoCard` for targeting vs modifiers distinction |
| Phase 3: Post-onboarding Activation (5 sub-steps) | `ChecklistItem` for each activation task |
| Critical Success Factors | `InfoCard` for each factor category (Technical, Client Understanding, AM Execution) |
| Common Pitfalls | `Accordion` for each pitfall with problem/fix structure |

### 5. `src/content/campaign-optimization-sop/index.mdx` — New file (create)

Full SOP content adapted from the Notion "Campaign Optimization SOP" page:

| Section | Interactive Components Used |
|---|---|
| 1.0 Purpose | `TipCallout variant="info"` |
| 2.0 Scope | plain text |
| 3.0 Definitions & Success Metrics | `InfoCard` for CPH, CPA, CPL definitions + `TipCallout variant="important"` for CPH benchmarks |
| 4.0 Executive Introduction | `TipCallout variant="info"` callout block |
| 5.0 Data Feedback Loop (Disposition Integration) | `StepByStep` for the 4 operational commands, `ChecklistItem` for QC checklist |
| 6.0 Strategic Optimization (4 sub-procedures) | `Accordion` for each pillar (demographics, geo/zip, source attribution, establishing authority) |
| 7.0 Budget Controls | `InfoCard` for Static vs Dynamic budgeting, `TipCallout variant="warning"` for pacing principle |
| 8.0 Core Targeting | `ChecklistItem` for non-negotiable filters |
| 9.0 Bid Modifiers & Conquesting | `Accordion` for each modifier strategy (carrier, demographic, auto-to-home, day-parting) |
| 10.0 Funnel Branding & Creative | `InfoCard` for each optimization type |
| 11.0 AI Call Scoring & Source Auditing | `StepByStep` for the AI audit workflow |
| 12.0 Critical Nuances | `TipCallout variant="warning"` for each nuance |
| 13.0 Summary: Optimization Loop | `StepByStep` with 5 loop steps |

### 6. `src/content/right-pricing-sop/index.mdx` — New file (create)

Full SOP content adapted from the Notion "Right Pricing SOP" page:

| Section | Interactive Components Used |
|---|---|
| Purpose | `TipCallout variant="info"` |
| Key Terminology | `InfoCard` for each term (Right Pricing, Base Bid, Source Modifiers, Day Part Schedule, CPL, CPA, Periscope, Traffic Channels, NA Channel) |
| Procedure: 6-Step Right Pricing | `StepByStep` with 6 steps |
| Step 1: Access Dashboard | `ChecklistItem` for each sub-task |
| Steps 2–6: Analysis through Monitor | Content within StepByStep, with `TipCallout variant="important"` for base bid best practice |
| 5.0 Critical Nuances | `Accordion` for each nuance (Directional Accuracy, Budget-Relative Bidding, Data-Driven Decisions, CPA Key Metric, Market Fluctuations, 2x Strategy) |

### 7. `src/content/sales-demo-sop/index.mdx` — New file (create)

Full SOP content adapted from the Notion "GOAL Sales Demo SOP" page:

| Section | Interactive Components Used |
|---|---|
| Purpose + When to Use + Roles | `TipCallout variant="info"` for purpose, `InfoCard` for roles |
| Definitions | `InfoCard` for each key definition (CPA, PPC, funnel goal, compliance backbone, feedback loop) |
| 0) Pre-call Prep | `ChecklistItem` for prep checklist |
| 1) Opening & Framing | `TipCallout variant="important"` for "what good sounds like" script |
| 2) Discovery & Qualification (5 sub-sections) | `Accordion` per sub-section, copy/paste discovery notes template in a code block |
| 3) Outside-in Framing | `StepByStep` with 2 steps (start outside GOAL → transition) |
| 4) Platform Demo (4-part structure) | `StepByStep` with 4 steps (Inputs → Decisions → Outputs → Controls) |
| 5) Value Narrative Modules (6 modules) | `Accordion` for each module (Consumer Journey, Money Page, Exclusivity, Campaign Config, Feedback Loop, AI Intelligence) |
| 6) Common Questions | `Accordion` for each FAQ |
| 7) Close with Next Steps | `ChecklistItem` for close sequence |
| 8) Post-demo | `ChecklistItem` for post-demo tasks, copy/paste email template in code block |
| 9) Financial Terms + Asset Checklist | Table for fee structure, `ChecklistItem` for go-live assets |
| Appendix A: Sales Scorecard | `Accordion` per phase with scoring criteria |

---

## Files NOT Modified (confirmed no changes needed)

- `src/app/guides/[slug]/page.tsx` — dynamic route handles any slug generically
- `src/components/mdx/MDXComponents.tsx` — all needed components already registered
- `src/components/guide/GuideLayout.tsx` — works for any guide
- `src/components/guide/GuideSidebar.tsx` — reads from `GuideMetadata`, non-breaking
- `src/app/guides/[slug]/GuideLayoutWrapper.tsx` — thin wrapper, no changes
- All interactive components — used as-is

---

## Implementation Order

1. **`src/lib/guides.ts`** — interface + all 8 entries first (avoids TS errors)
2. **`src/content/account-review-sop/index.mdx`** — create MDX content
3. **`src/content/client-onboarding-sop/index.mdx`** — create MDX content
4. **`src/content/campaign-optimization-sop/index.mdx`** — create MDX content
5. **`src/content/right-pricing-sop/index.mdx`** — create MDX content
6. **`src/content/sales-demo-sop/index.mdx`** — create MDX content
7. **`src/app/page.tsx`** — landing page restructure (two sections)

## Verification

1. `npm run dev` — confirm site loads without errors
2. Landing page — verify two distinct sections appear ("Software Guides" and "Standard Operating Procedures") with different visual treatments
3. Navigate to each SOP route and confirm rendering:
   - `/guides/account-review-sop`
   - `/guides/client-onboarding-sop`
   - `/guides/campaign-optimization-sop`
   - `/guides/right-pricing-sop`
   - `/guides/sales-demo-sop`
4. Confirm all interactive components work (InfoCards expand, StepByStep navigates, Accordions toggle, TipCallouts display, ChecklistItems track)
5. Existing guides at `/guides/notion`, `/guides/claude-cowork`, `/guides/close-crm` still work unchanged
6. `npm run build` — confirm static generation succeeds for all 8 slugs

## Source Content

All SOP content lives in Notion under the **GOAL Resources** database:
- **Database data source:** `e9e2984e-bf93-8239-837a-87192c44fe5b`
- **Path:** GOAL Knowledge Base → Backend → GOAL KB Databases → Notes & Resources → GOAL Resources
