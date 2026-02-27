/**
 * Capture screenshots from Close CRM's public marketing pages.
 *
 * Usage:
 *   npx playwright install chromium   # first time only
 *   npm run screenshots
 */

import { chromium } from 'playwright';
import path from 'path';

const OUTPUT_DIR = path.resolve(__dirname, '../public/images/guides/close-crm');

const pages = [
  {
    url: 'https://www.close.com/product/',
    name: 'settings-overview',
    waitFor: 'networkidle' as const,
  },
  {
    url: 'https://www.close.com/product/',
    name: 'lead-creation',
    waitFor: 'networkidle' as const,
    scrollY: 600,
  },
  {
    url: 'https://www.close.com/product/pipeline/',
    name: 'pipeline-view',
    waitFor: 'networkidle' as const,
  },
  {
    url: 'https://www.close.com/product/',
    name: 'smart-views',
    waitFor: 'networkidle' as const,
    scrollY: 1200,
  },
  {
    url: 'https://www.close.com/product/reporting/',
    name: 'dashboard-reporting',
    waitFor: 'networkidle' as const,
  },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 675 },
    deviceScaleFactor: 2,
  });

  for (const entry of pages) {
    const page = await context.newPage();
    console.log(`Capturing ${entry.name} from ${entry.url}...`);

    await page.goto(entry.url, { waitUntil: entry.waitFor });

    // Dismiss any cookie banners or overlays
    try {
      const dismissBtn = page.locator('button:has-text("Accept"), button:has-text("Got it"), button:has-text("Close")').first();
      await dismissBtn.click({ timeout: 3000 });
    } catch {
      // No dismiss button found — that's fine
    }

    if (entry.scrollY) {
      await page.evaluate((y) => window.scrollTo(0, y), entry.scrollY);
      await page.waitForTimeout(500);
    }

    const outputPath = path.join(OUTPUT_DIR, `${entry.name}.png`);
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log(`  Saved: ${outputPath}`);
    await page.close();
  }

  await browser.close();
  console.log('\nDone! All screenshots captured.');
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
