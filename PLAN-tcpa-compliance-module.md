# Plan: Add TCPA Compliance & 1-to-1 Consent Training Module

## Context

The source document `TCPA Compliance and 1-to-1 Consent.md` contains a complete sales training module (3 sessions, ~45 min) teaching reps to pitch GOAL's compliance-first positioning. It needs to be converted into an interactive course module on the existing Next.js/MDX training platform, with engaging visuals and interactive elements to keep trainees engaged.

## Files to Modify

### 1. `src/lib/guides.ts` — Add metadata entry

Insert new guide object into the `guides` array:

```typescript
{
  slug: 'tcpa-compliance',
  title: 'TCPA Compliance & 1-to-1 Consent',
  description:
    'Confidently explain the TCPA risk landscape, clarify 1-to-1 consent, and position GOAL\'s funnel + proof stack as the safest way to buy leads.',
  chapters: 8,
  estimatedTime: '45 min',
  difficulty: 'Intermediate',
  category: 'sop',
}
```

### 2. `src/components/mdx/MDXComponents.tsx` — Register new component

Add import and registration for `FunnelVisualization`.

## Files to Create

### 3. `src/components/interactive/FunnelVisualization.tsx` — NEW component

The animated funnel is the visual centerpiece of Session 1.2. No existing component represents a narrowing funnel with sequential reveal — `StepByStep` is linear/vertical and lacks the visual metaphor.

**Props:**
```typescript
interface FunnelStep {
  label: string;
  description: string;
  icon?: string;  // emoji
}
interface FunnelVisualizationProps {
  steps: FunnelStep[];
  title?: string;
}
```

**Design:**
- Wrapped in `BrowserChrome` (dark variant) — matching `AnimatedDemo` pattern
- Each step renders as a horizontal bar narrowing progressively (100% -> 85% -> 70% -> 55% -> 40%)
- Framer Motion `whileInView` with staggered delays for reveal animation
- Click a bar to expand its description below
- GOAL blue gradient from `primary-300` (top) to `primary-700` (bottom)
- `useSyncExternalStore` for `prefers-reduced-motion` (same as `AnimatedDemo`)
- Responsive: on mobile (<640px), reduce width differential so bars stay readable

**Reference pattern:** `src/components/interactive/AnimatedDemo.tsx` — uses `BrowserChrome`, `useInView`, `useSyncExternalStore`, auto-play on scroll.

### 4. `src/content/tcpa-compliance/index.mdx` — Module content

8 H2 sections (chapters), using existing + new interactive components throughout:

---

**## Module Overview**
- `TipCallout variant="info"` — module purpose statement
- `InfoCard title="Learning Objectives" icon="target"` — 5 objectives from source doc
- `InfoCard title="Prerequisites" icon="clipboard"` — GOAL platform basics
- `DataTable` — definitions table (TCPA, 1-to-1 consent, shared lead, consent artifact, proof stack)

**## The Regulatory Landscape** (Session 1.1)
- `TipCallout variant="warning"` — "We do not provide legal advice" disclaimer
- `InfoCard` x3 — "Why This Matters Now", "What 1-to-1 Consent Changes", "Shared Leads = Risk Multiplier"
- `DataTable` — side-by-side comparison: Shared Lead Model vs 1-to-1 Consent Model (5 rows: who gets lead, consent clarity, consumer experience, defensibility, complaint likelihood)
- `CopyableTemplate` — Session 1.1 talk track (the two script lines from source)
- `Accordion` — DNC & EBR high-level explanation

**## Session 1.1: Knowledge Check**
- `TipCallout variant="tip"` — practice activity prompt ("In one sentence, explain 1-to-1 consent")
- `Quiz id="tcpa-1-1"` — 3-4 questions on shared lead risk, consent definition, positioning
- `ChecklistItem` — "I can explain the difference between shared leads and 1-to-1 consent"

**## GOAL's Exclusive Funnel** (Session 1.2)
- `FunnelVisualization` — the animated 5-step funnel (High-Intent Click -> Branded Landing Page -> 1-to-1 Consent Language -> Form Submission -> Lead Delivery + Proof)
- `InfoCard` — "Why Self-Contained Matters"
- `CopyableTemplate` — differentiation statement ("We aren't a lead marketplace...")
- `TipCallout variant="warning"` — common pitfalls (over-promising, sounding like legal counsel)
- `Quiz id="tcpa-1-2"` — 2-3 questions on funnel steps and differentiation
- `ChecklistItem` — "I can walk through the 5-step funnel"

**## The Proof Stack** (Session 1.3)
- `InfoCard` x2 — TrustedForm/Jornaya explanation, Session Replay explanation
- `TipCallout variant="important"` — "If someone files a complaint, you need a receipt. This is the receipt."
- `StepByStep` — 5-step demo flow (open sample lead -> locate certificate -> show timestamp/consent -> show replay -> tie back to 1-to-1)
- `ChecklistItem` — "I can walk through the proof stack demo"

**## Objection Handling: "I Can Buy Cheaper Leads"**
- `Accordion` — scenario setup (the price objection context)
- `CopyableTemplate` — 4-section response framework (Acknowledge -> Differentiate -> Risk Reframe -> Close) with exact scripts from source
- `TipCallout variant="tip"` — roleplay exercise instructions
- `TipCallout variant="warning"` — coaching note (listen for over-promising)
- `Quiz id="tcpa-objection"` — 2 questions on response framework
- `ChecklistItem` — "I can handle the 'cheaper leads' objection without making legal claims"

**## Module Deliverables & Assessment**
- 4x `ChecklistItem` — elevator pitch, 1-to-1 consent explanation, proof stack demo, objection response
- `DataTable` — pass/fail rubric (4 rows: Skill | Pass Criteria)

**## Appendix: Copy-Ready Talk Tracks**
- `CopyableTemplate` — 30-second elevator pitch (full text from appendix)
- `CopyableTemplate` — 10-second definition
- `CopyableTemplate` — full objection response script

## Why No Other New Components Are Needed

- **Comparison card (Shared vs 1-to-1):** `DataTable` handles this — same pattern used in competition-research module
- **Roleplay scenario:** Compose `Accordion` + `CopyableTemplate` + `TipCallout` — matches existing setting-expectations-sop patterns
- **Demo timeline:** `StepByStep` maps directly to the 5-step demo flow

## Verification

1. Run `npm run dev`
2. Navigate to dashboard — confirm new course card appears with correct metadata
3. Navigate to `/guides/tcpa-compliance` — verify:
   - All 8 H2 sections appear in sidebar TOC
   - FunnelVisualization animates on scroll (and respects reduced-motion)
   - All Quiz components render and persist scores to localStorage
   - All CopyableTemplate components copy text correctly
   - ChecklistItem states persist across page reloads
   - Progress tracking works (sections complete as scrolled)
4. Test mobile responsiveness — sidebar becomes FAB, funnel bars stay readable
5. Run `npm run build` to confirm no build errors
