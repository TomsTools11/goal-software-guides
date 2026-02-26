# Goal Style Guide Brand + Layout Overview

GOAL’s marketing site reads as a B2B insurance SaaS platform: conversion-focused hero, proof (testimonial), feature sections, and compliance-heavy legal copy. The core layout patterns:
- Single-column centered hero with headline, supporting copy, CTA pair (primary + secondary).
- Striped vertical sections (hero, “Your Goal Platform”, pipeline/conversion/performance/grow, “Built for the insurance industry”, closing CTA).
- Consistent “headline + paragraph + CTA or icon” pattern across sections.
- Top nav with logo left, phone + login + “Request a free demo” form at the top of the page.
- Footer with legal links, phone, and a short brand statement.

Use this guide as the central reference for any marketing, landing, or product pages built for GOAL.

# Color System

The HTML and captured content do not expose explicit hex values for the live site. Below is a structured color system with placeholders you can wire to your actual brand tokens (e.g., from Figma or your CSS variables). Replace `#XXXXXX`with the real hex values from your design source of truth.

## Core Palette

- **Primary / Brand**
  - Usage: main CTAs (Book Demo), links on hover, key highlights, progress indicators.
  - Token: `--color-primary`
  - Example placeholder: `#006CFF` (bright SaaS blue – replace with actual GOAL blue if different)
- **Primary Dark**
  - Usage: hover states for primary buttons, focus outlines.
  - Token: `--color-primary-dark`
  - Placeholder: `#0050BF`
- **Secondary / Accent**
  - Usage: subtle accents, icons, chips, badges (e.g., “rating”, “Check” icons), secondary CTA outlines.
  - Token: `--color-accent`
  - Placeholder: `#933974` (if GOAL uses a magenta accent; otherwise replace with actual)
- **Background**
  - Usage: page background, light strips between sections.
  - Token: `--color-bg`
  - Placeholder: `#FFFFFF`
- **Section Background (Soft Grey)**
  - Usage: hero form area background, full-width strips like reporting/analytics.
  - Token: `--color-bg-soft`
  - Placeholder: `#F5F5F7`
- **Surface / Cards**
  - Usage: cards for features (Custom Branded, Pay-per-click, Targeting, etc.).
  - Token: `--color-surface`
  - Placeholder: `#FFFFFF` (with subtle shadow or border)

## Text Colors

- **Body Text**: `--color-text` – high contrast body copy.
  - Placeholder: `#1A1A1A`
- **Muted Text**: `--color-text-muted` – consent copy, disclaimers.
  - Placeholder: `#666666`
- **Inverse Text**: `--color-text-inverse` – on dark buttons/pills.
  - Placeholder: `#FFFFFF`
- **Link Text**: `--color-link` – default links (e.g., privacy, terms).
  - Placeholder: `--color-primary`

## Status & Utility

- **Success**: `--color-success` – check icons, “5x conversions” emphasis.
  - Placeholder: `#16A34A`
- **Warning**: `--color-warning` – optional (e.g., budget alerts, compliance notices).
  - Placeholder: `#F59E0B`
- **Error**: `--color-error` – validation states on forms.
  - Placeholder: `#DC2626`
- **Border / Divider**: `--color-border` – card borders, field outlines.
  - Placeholder: `#E2E2E8`

## CSS Token Example

```css
:root {
  --color-primary: #006CFF;
  --color-primary-dark: #0050BF;
  --color-accent: #933974;
  --color-bg: #FFFFFF;
  --color-bg-soft: #F5F5F7;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-muted: #666666;
  --color-text-inverse: #FFFFFF;
  --color-link: var(--color-primary);
  --color-success: #16A34A;
  --color-error: #DC2626;
  --color-border: #E2E2E8;
}
```

# Typography System

The site uses a clear hierarchy: big hero H1, supporting H2/H3, bold section headings (“THE OLD WAY VS. THE GOAL WAY”), and dense legal copy.

## Font Stack

Use a modern, neutral SaaS sans-serif family:
- Primary family: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- If you standardize around a specific family (e.g., Inter, Roboto, or similar), define:

```css
:root {
  --font-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
body {
  font-family: var(--font-sans);
}
```

## Type Scale

Align with what appears on the page:
- **H1 – Hero headline**
  - Example: “Generate Your own in-market Insurance Leads”
  - Size: 40–48px, weight: 700, line-height: 1.1–1.2
- **H2 – Section headline**
  - Example: “CONVERT PROSPECTS INTO POLICIES”, “FILL YOUR PIPELINE WITH NEW CUSTOMERS”
  - Size: 28–32px, weight: 700, line-height: 1.2
- **H3 – Subsection heading / feature label**
  - Example: “Custom Branded”, “Pay-per-click”, “Advanced Reporting & Analytics”
  - Size: 20–24px, weight: 600, line-height: 1.3
- **H4 – Micro heading / overline**
  - Example: “YOUR GOAL PLATFORM”, “A BETTER WAY TO GROW”
  - Size: 14–16px, weight: 600, letter-spacing: 0.08em (often all caps), line-height: 1.4
- **Body / Paragraph**
  - Marketing copy, testimonials, consent text.
  - Size: 16px, weight: 400, line-height: 1.5–1.7
- **Small / Legal**
  - Consent, TCPA language, cookie notice.
  - Size: 13–14px, weight: 400, line-height: 1.6–1.8, color: `--color-text-muted`

## Typography CSS Example

```css
h1 {
  font-size: 3rem;      /* ~48px */
  line-height: 1.15;
  font-weight: 700;
}
h2 {
  font-size: 2rem;      /* ~32px */
  line-height: 1.2;
  font-weight: 700;
}
h3 {
  font-size: 1.5rem;    /* ~24px */
  line-height: 1.3;
  font-weight: 600;
}
h4, .eyebrow {
  font-size: 0.875rem;  /* 14px */
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
}
body {
  font-size: 1rem;      /* 16px */
  line-height: 1.6;
}
.small, .legal-text {
  font-size: 0.8125rem; /* 13px */
  line-height: 1.7;
  color: var(--color-text-muted);
}
```

# Spacing, Grid, and Layout

The content structure implies a standard responsive grid with generous vertical spacing.

## Spacing Scale

Use a 4 or 8px-based scale; examples below use 8:
- `--space-1`: 4px (tight)
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 24px
- `--space-6`: 32px
- `--space-7`: 40px
- `--space-8`: 48px
- `--space-9`: 64px

Patterns from the page:
- Section vertical padding: 64–96px.
- Card padding: 20–32px.
- Space between heading and body text: 12–16px.
- Space between paragraphs and CTAs: 16–24px.

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
  --space-9: 64px;
}
.section {
  padding-block: var(--space-9);
}
.section--tight {
  padding-block: var(--space-7);
}
.stack > * + * {
  margin-top: var(--space-4);
}
```

## Grid

- Desktop: 12-column grid, max content width ~1100–1200px, centered.
- Hero: 2-column layout (left: text, right: demo form) on desktop; stacked on mobile.
- Feature zones: 3-column or 2-column cards (“Custom Branded, Pay-per-click, Budget Control, Targeting, Optimized, Secure”).
- Responsive behavior: Stack columns at &lt;= 768px, keep consistent internal padding.

```css
.container {
  max-width: 1120px;
  margin-inline: auto;
  padding-inline: 16px;
}
.grid {
  display: grid;
  gap: 32px;
}
.grid--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (max-width: 768px) {
  .grid--2,
  .grid--3 {
    grid-template-columns: 1fr;
  }
}
```

# Buttons and Links

The site prominently uses “Book a Demo” / “See it in action” CTAs plus text links (Privacy Policy, Terms of Use).

## Button Types

- **Primary Button – High emphasis**
  - Examples: “Book a Demo”, “Get Started”.
  - Usage: Hero, repeated CTAs at bottom of page.
- **Secondary Button – Ghost/outlined or link-style**
  - Example: “See it in action”.
- **Destructive / Subtle** – Not on marketing page; define for product UI.

## Button Styles

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 999px; /* pill-style or use 8px for more square */
  font-weight: 600;
  font-size: 0.9375rem; /* 15px */
  line-height: 1.2;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}
.button--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}
.button--primary:hover {
  background-color: var(--color-primary-dark);
}
.button--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.button--secondary:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
```

## Links

- Inline legal links (“Privacy Policy”, “Terms of Use”) appear in long paragraphs.
- Hover state should be color change and optional underline.

```css
a {
  color: var(--color-link);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
```

# Form Styles

The “Request a free demo” form at the top of the page is central to the site.

**Fields:**
- First Name (text)
- Last Name (text)
- Email (email)
- Phone (tel)
- Carrier (select dropdown)
- Submit button (“Book Demo” or “Get Started”)

**Patterns:**
- Labels above fields.
- Full-width inputs, consistent height.
- Legal consent block below button with small text.

## Base Form Styles

```css
.form {
  display: grid;
  gap: 16px;
}
.form__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}
.form__input,
.form__select {
  height: 44px;
  padding-inline: 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  font-size: 0.9375rem;
  color: var(--color-text);
  background-color: #FFFFFF;
}
.form__input:focus,
.form__select:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 0;
  border-color: var(--color-primary);
}
.form__help,
.form__legal {
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}
```

## Error States

```css
.form__field--error .form__input,
.form__field--error .form__select {
  border-color: var(--color-error);
}
.form__error-message {
  font-size: 0.75rem;
  color: var(--color-error);
  margin-top: 4px;
}
```

# Iconography & Imagery

## Iconography

The content references icons by label:
- “rating” near testimonial (star rating graphic)
- “pipeline”, “conversion”, “performance”, “grow”, “prospects”
- Feature icons: “Custom Branded”, “Pay-per-click”, “Budget Control”, “Targeting”, “Optimized”, “Secure”
- CRM and account management icons.

**Guidelines:**
- Use a single icon set (e.g., outline icons at 24px or 32px).
- Stroke or fill color should generally use `--color-primary` or `--color-accent`.
- Always align icons left of text with 8–12px gap.

```css
.icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--color-primary);
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
```

## Imagery

From content structure:
- Hero likely includes abstract product imagery or dashboards.
- Sections reference insurance workflows; imagery should show:
  - Agents and customers in professional, realistic contexts.
  - Screenshots of GOAL reporting and QuoteFunnels (ensure data is scrubbed).
  - Abstract illustrations for pipeline, reporting, compliance.

**Guidelines:**
- Prefer photography showing real agents and local community over generic stock.
- Maintain consistent color grading that leans into your primary color (subtle blue/magenta casts instead of orange-heavy).
- Use rounded corners and subtle shadows on screenshots to match card styling.

# Components Library

## Hero Section

**Content from page:**

“Generate Your own in-market Insurance Leads”

Supporting paragraph, social proof, and two CTAs: Book a Demo / See it in action.

**Structure:**

```html
<section class="hero">
  <div class="container grid grid--2 hero__grid">
    <div class="hero__content stack">
      <p class="eyebrow">Your Goal Platform</p>
      <h1>Generate Your own in-market Insurance Leads</h1>
      <p>Goal is a comprehensive marketing technology platform that will help you attract, capture, and convert your own insurance leads into policies at a highly profitable ROI.</p>
      <div class="hero__actions">
        <a class="button button--primary" href="#demo">Book a Demo</a>
        <a class="button button--secondary" href="#video">See it in action</a>
      </div>
      <div class="hero__testimonial">
        <p><em>“I’ve had mixed results with different lead vendors over the years but GOAL is a game changer. I have been recommending it to all my colleagues.”</em></p>
        <p><strong>Aimee Collins - Independent Agent</strong></p>
      </div>
    </div>
    <aside class="hero__form-card">
      <!-- demo form -->
    </aside>
  </div>
</section>
```

**Key traits:**
- Light or white background, strong primary CTA.
- Testimonial and rating near CTAs.

## Feature Cards (“Your GOAL Platform” & “FILL YOUR PIPELINE…”)

These sections use repeated “icon + heading + body” components.

```html
<section class="section section--features">
  <div class="container">
    <h2>Keep your team busy with a steady flow of exclusive leads</h2>
    <p class="section__intro">Target in-market insurance prospects looking for a local agent.</p>
    <div class="grid grid--3">
      <article class="card card--feature">
        <div class="card__icon">
          <!-- icon svg -->
        </div>
        <h3>Custom Branded</h3>
        <p>Customize your ad creatives &amp; profile with your logo &amp; branding.</p>
      </article>
      <!-- more cards -->
    </div>
  </div>
</section>
```

```css
.card {
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
}
.card--feature h3 {
  margin-bottom: 8px;
}
```

## Comparison Block (“The Old Way vs. The GOAL Way”)

Text shows two parallel lists: “The Old Way” (x bullets) vs “The GOAL Way” (check bullets).

```html
<section class="section section--comparison">
  <div class="container grid grid--2">
    <div class="comparison__column comparison__column--old">
      <h3>The Old Way</h3>
      <ul class="list list--negative">
        <li>Aggregator leads shared with 5–10 agents</li>
        <li>Low contact rates and confused consumers</li>
        <li>Contracts requiring you to continue to spend on leads resulting in high CPAs and wasted marketing dollars.</li>
      </ul>
    </div>
    <div class="comparison__column comparison__column--goal">
      <h3>The GOAL Way</h3>
      <ul class="list list--positive">
        <li>Generate your own exclusive leads</li>
        <li>QuoteFunnels branded with your agency information resulting in 5x conversions</li>
        <li>Flexible campaigns based on your own marketing budget and capacity.</li>
      </ul>
    </div>
  </div>
</section>
```

```css
.list {
  list-style: none;
  padding-left: 0;
}
.list li {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 8px;
}
.list--negative li::before {
  content: "✕";
  color: var(--color-error);
  margin-top: 2px;
}
.list--positive li::before {
  content: "✔";
  color: var(--color-success);
  margin-top: 2px;
}
```

## Closing CTA (“LET US HELP YOU REACH YOUR GOAL.”)

**Structure:**

```html
<section class="section section--closing-cta">
  <div class="container stack stack--center">
    <h2>LET US HELP YOU REACH YOUR GOAL.</h2>
    <p>Speak with one of our account managers today and see how we can help you grow your book of business.</p>
    <a class="button button--primary" href="#demo">Book a Demo</a>
  </div>
</section>
```

**Traits:**
- Center-aligned text.
- Strong CTA repeated for consistency.
- Optionally a subtle colored background (`--color-bg-soft`).

# Compliance & Legal Content Style

The site contains heavy TCPA, privacy, and terms copy. Treat this as a distinct content type.
- **Font size**: 13–14px.
- **Line height**: 1.7–1.8.
- **Color**: `--color-text-muted`.
- **Links**: `--color-link` with underline on hover.
- **Paragraph spacing**: 8–12px between paragraphs.

```css
.legal-block {
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}
.legal-block p + p {
  margin-top: 8px;
}
```

# Footer

From the current page:
- **Text**: “© 2025 Goal Platform, LLC. All Rights Reserved. Reach your Goal with the best insurance marketing and lead generation system in the industry”
- **Links**: Terms of Use, Privacy Policy, Login, Request a Demo, phone number.
- Likely a muted background strip with small text.

```html
<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__left">
      <p>© 2025 Goal Platform, LLC. All Rights Reserved</p>
      <p>Reach your Goal with the best insurance marketing and lead generation system in the industry</p>
    </div>
    <nav class="footer__nav">
      <a href="/terms-of-use">Terms of Use</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/login">Login</a>
      <a href="/request-demo">Request a Demo</a>
      <a href="tel:18775544461">(877) 554-4461</a>
    </nav>
  </div>
</footer>
```

```css
.footer {
  background-color: var(--color-bg-soft);
  padding-block: 24px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.footer__nav a {
  color: var(--color-text-muted);
}
.footer__nav a:hover {
  color: var(--color-link);
}
```

# Implementation Notes

- Wire all actual brand hex codes from your design team or CSS variables into the token placeholders in section 2.
- Keep hero, feature blocks, comparison, and closing CTA consistent across future pages (e.g., verticals, campaign-specific LPs).
- Ensure forms and legal blocks always use the same typography and spacing to maintain compliance clarity.

This structure can now be used as the single source of truth for GOAL’s marketing site and extended into product UI as needed.