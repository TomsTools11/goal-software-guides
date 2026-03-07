# Plan: Add "Brand Positioning for Captive Agents" Module

## Context

The training content in `Brand Positioning for Captive Agents.md` needs to be added to the Next.js training platform as an interactive course module. The content teaches sales reps how to coach captive insurance agents to use local branding instead of corporate carrier logos to improve ad conversion. It has 3 lessons, talk tracks, objection handling, and workshop activities. The goal is engaging visuals and interactive elements to keep trainees engaged.

## Summary of Changes

1. **4 new interactive components** (most impactful for engagement)
2. **1 guide metadata entry** in `src/lib/guides.ts`
3. **Component registration** in `src/components/mdx/MDXComponents.tsx`
4. **1 MDX content file** at `src/content/brand-positioning-captive/index.mdx`

---

## 1. New Interactive Components

All in `src/components/interactive/`, following existing patterns: `'use client'`, Framer Motion animations, Tailwind design tokens, BrowserChrome wrapper where appropriate.

### A. `BeforeAfter.tsx` — Ad copy comparison with toggle

- Two-column layout (desktop) / toggle switch (mobile)
- "Before" side: red-tinted border/bg, "After" side: green-tinted
- Each side renders a mockup ad card (headline, subhead, bullets, badge pill)
- AnimatePresence crossfade on toggle
- Props: `id`, `before: { headline, subhead?, bullets?, badge? }`, `after: { ... }`

### B. `ObjectionCard.tsx` — Flip card (objection front / response back)

- CSS 3D perspective flip via Framer Motion `rotateY`
- Front: dark surface, "OBJECTION" label, objection text, flip hint icon
- Back: primary-tinted bg, response text, optional coaching tip callout
- Click/Enter/Space to flip; accessible
- Props: `id`, `objection`, `response`, `tip?`

### C. `ScriptBlock.tsx` — Conversation/script display with speaker labels

- BrowserChrome wrapper, chat-style rows
- Speaker pills: agent (blue), prospect (gray), narrator (italic muted, no pill)
- Lines animate in with staggered `motion.div` using `useInView` (trigger on scroll)
- `highlight: true` lines get accent left border
- Props: `title?`, `lines: { speaker, type, text, highlight? }[]`

### D. `RevealCard.tsx` — Sequential progressive reveal

- Horizontal progress bar with 3 clickable stage indicators (circles + labels + connecting line)
- Stages unlock sequentially (must complete 1 before 2 becomes clickable)
- Content panel animates in below on click
- Success banner when all stages complete
- localStorage persistence via `id` prop
- Props: `id`, `title`, `stages: { label, content, icon? }[]`

---

## 2. Guide Metadata

Add to the `guides` array in `src/lib/guides.ts`:

```typescript
{
  slug: 'brand-positioning-captive',
  title: 'Brand Positioning for Captive Agents',
  description:
    'Help captive agents compete by building a local identity that earns trust before revealing carrier affiliation — ad positioning, landing page strategy, and the bait-educate-reveal sales motion.',
  chapters: 8,
  estimatedTime: '30 min',
  difficulty: 'Intermediate',
  category: 'sop',
}
```

---

## 3. Component Registration

Add imports and entries in `src/components/mdx/MDXComponents.tsx` for `BeforeAfter`, `ObjectionCard`, `ScriptBlock`, `RevealCard`.

---

## 4. MDX Content Structure (8 chapters)

File: `src/content/brand-positioning-captive/index.mdx`

### Ch 1: `## Overview & Learning Objectives`
- `<TipCallout variant="info">` — Purpose statement
- `<InfoCard icon="🎯">` — 5 learning objectives
- `<InfoCard icon="📋">` — Prerequisites
- `<DataTable>` — Key terms (captive agent, corporate brand bias, cannibalization, DBA/local identity, reveal moment)

### Ch 2: `## The Problem with Corporate Branding`
- `<InfoCard icon="🧠">` — Consumer bias (3 assumptions)
- `<InfoCard icon="⚠️">` — Cannibalization risk
- `<TipCallout variant="warning">` — Red flags to avoid
- `<Accordion>` — Discussion prompt with example answers
- `<Quiz id="bpc-problem">` — 2 questions on brand bias & cannibalization

### Ch 3: `## Sales Talk Track: Explaining the Problem`
- `<ScriptBlock>` — Coachable talk track as conversation (narrator + agent lines)
- `<CopyableTemplate>` — Copy-ready version of the talk track

### Ch 4: `## The Local Identity Strategy`
- `<StepByStep>` — 3 steps: naming, trust signals, curiosity positioning
- `<TipCallout variant="warning">` — What NOT to do
- `<DataTable>` — "What to Do" vs "What to Avoid"

### Ch 5: `## Before & After: Ad Copy Workshop`
- Two `<BeforeAfter>` components showing corporate vs local identity ad copy
- `<CopyableTemplate>` — Blank template for learners to draft their own
- `<Quiz id="bpc-workshop">` — 2 questions on positioning choices

### Ch 6: `## The Bait-Educate-Reveal Sales Motion`
- `<RevealCard>` — 3-stage interactive reveal (Bait -> Educate -> Reveal)
- `<ScriptBlock>` — Full first-call script (opening, discovery, educate, reveal)
- `<CopyableTemplate>` — Copy-ready first-call script

### Ch 7: `## Objection Handling`
- Two `<ObjectionCard>` components (flip cards):
  1. "Why does this not look like [Carrier]?"
  2. "I can just get a quote online."
- `<Accordion>` — Roleplay activity instructions
- `<Quiz id="bpc-objections">` — 3 questions on objection handling

### Ch 8: `## Module Deliverables & Assessment`
- `<TipCallout variant="important">` — 4 deliverables summary
- `<DataTable>` — Pass/fail rubric (4 criteria)
- `<Accordion>` — Coaching notes for managers
- `<CopyableTemplate>` — 30-second pitch + 10-second definition

---

## Implementation Sequence

1. Create 4 new component files (can be built in parallel — independent)
2. Register components in MDXComponents.tsx
3. Add guide metadata in guides.ts
4. Create `src/content/brand-positioning-captive/index.mdx` with full content
5. Test

## Key Files to Modify

| File | Change |
|------|--------|
| `src/lib/guides.ts` | Add metadata entry |
| `src/components/mdx/MDXComponents.tsx` | Import + register 4 components |

## New Files to Create

| File | Purpose |
|------|---------|
| `src/components/interactive/BeforeAfter.tsx` | Ad copy comparison toggle |
| `src/components/interactive/ObjectionCard.tsx` | Flip card for objections |
| `src/components/interactive/ScriptBlock.tsx` | Conversation script display |
| `src/components/interactive/RevealCard.tsx` | Sequential stage reveal |
| `src/content/brand-positioning-captive/index.mdx` | Module content |

## Pattern References (reuse existing conventions)

- `src/components/interactive/Quiz.tsx` — localStorage persistence, BrowserChrome wrapping, AnimatePresence
- `src/components/interactive/StepByStep.tsx` — Step indicator layout, sequential progression
- `src/components/interactive/AnimatedDemo.tsx` — `useInView` scroll-triggered animation
- `src/content/setting-expectations-sop/index.mdx` — Closest existing SOP in style (sales training, talk tracks, objections)

## Verification

1. `npm run dev` / `next dev` — start dev server
2. Navigate to dashboard — confirm new module card appears in SOP category
3. Navigate to `/guides/brand-positioning-captive` — verify:
   - All 8 chapters render in sidebar ToC
   - BeforeAfter toggle works on desktop and mobile
   - ObjectionCards flip on click and keyboard
   - ScriptBlock lines animate in on scroll
   - RevealCard stages unlock sequentially, persist in localStorage
   - All Quiz components score and persist correctly
   - CopyableTemplate copy buttons work
   - Progress tracking marks sections as completed on scroll
4. Test dark mode — all components respect design tokens
5. Test mobile viewport — responsive layouts for BeforeAfter toggle, ScriptBlock condensed pills
