import 'dotenv/config';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import prisma from '../lib/db';
import { auth } from '../lib/auth';
// @ts-expect-error - better-call is an internal dependency of better-auth
import { serializeSignedCookie } from 'better-call';

const viewports = [
  { name: 'mobile-small', width: 375, height: 667 },   // iPhone SE
  { name: 'mobile-large', width: 390, height: 844 },   // iPhone 14 / 15
  { name: 'tablet', width: 768, height: 1024 },        // iPad
  { name: 'desktop', width: 1440, height: 900 },       // Laptop
  { name: 'desktop-fullhd', width: 1920, height: 1080 }, // Full HD Desktop
];

async function getAuthCookies(hostname: string) {
  try {
    const session = await prisma.session.findFirst({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { updatedAt: 'desc' },
    });
    if (!session) return [];

    const ctx = await auth.$context;
    const cookieName = ctx.authCookies.sessionToken.name;
    const cookieStr = await serializeSignedCookie(
      cookieName,
      session.token,
      ctx.secret,
      ctx.authCookies.sessionToken.options
    );

    const match = cookieStr.match(/=([^;]+)/);
    if (!match) return [];
    const signedValue = decodeURIComponent(match[1]);

    const cookies = [
      {
        name: cookieName,
        value: signedValue,
        domain: hostname,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax' as const,
      },
    ];

    if (cookieName.startsWith('__Secure-')) {
      cookies.push({
        name: cookieName.replace('__Secure-', ''),
        value: signedValue,
        domain: hostname,
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax' as const,
      });
    }

    return cookies;
  } catch (err) {
    console.error('Failed to prepare auth cookies:', err);
    return [];
  }
}

(async () => {
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const url = process.argv[2] || 'http://localhost:3001/dashboard/progress';
  const parsedUrl = new URL(url);

  console.log(`\n🔍 Checking responsiveness & sidebar behavior for: ${url}`);
  const isPublicAuthPage = url.includes('/auth/');
  const authCookies = !isPublicAuthPage ? await getAuthCookies(parsedUrl.hostname) : [];
  if (authCookies.length > 0) {
    console.log(`🔑 Injected signed Better-Auth session cookie (${authCookies.length} cookie variants)\n`);
  } else {
    console.log(`ℹ️  Running unauthenticated\n`);
  }

  const browser = await chromium.launch();

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });

    if (authCookies.length > 0) {
      await context.addCookies(authCookies);
    }

    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(1500); // allow layout, effects and hydration to settle
    } catch (err) {
      console.error(`Failed to load ${url} at ${vp.name}:`, (err as Error).message);
      await context.close();
      continue;
    }

    const currentUrl = page.url();

    // 1. Check layout metrics before scroll
    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
      const clientWidth = doc.clientWidth;
      const hasOverflowX = scrollWidth > clientWidth;
      const overflowDelta = scrollWidth - clientWidth;

      const interactiveElements = Array.from(
        document.querySelectorAll('button, a, input, select, textarea, [role="button"]')
      );

      const tinyTapTargets = interactiveElements
        .map(el => {
          const r = el.getBoundingClientRect();
          const text = ((el as HTMLElement).innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').slice(0, 30).trim();
          return {
            tag: el.tagName.toLowerCase(),
            text,
            width: Math.round(r.width),
            height: Math.round(r.height),
            visible: r.width > 0 && r.height > 0 && window.getComputedStyle(el).visibility !== 'hidden'
          };
        })
        .filter(t => t.visible && (t.width < 36 || t.height < 36));

      return {
        hasOverflowX,
        overflowDelta,
        tinyTapCount: tinyTapTargets.length,
        tinyTapExamples: tinyTapTargets.slice(0, 5)
      };
    });

    // 2. Test sidebar position during vertical scroll (for tablet and desktop)
    let sidebarStatus = 'N/A (Mobile)';
    const sidebar = page.locator('aside');
    const isSidebarVisible = await sidebar.isVisible().catch(() => false);

    if (isSidebarVisible) {
      // Scroll down by 500px
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      const scrolledBox = await sidebar.boundingBox();

      if (scrolledBox && Math.round(scrolledBox.y) === 0) {
        sidebarStatus = '✅ Sticky/Locked at top: 0px';
      } else {
        sidebarStatus = `❌ Scrolled away (y: ${Math.round(scrolledBox?.y ?? -999)}px)`;
      }

      // Scroll back up for clean full-page screenshot
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
    }

    const screenshotPath = path.join(screenshotsDir, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const statusBadge = !metrics.hasOverflowX ? '✅ OK' : `❌ OVERFLOW (+${metrics.overflowDelta}px)`;
    console.log(`[${vp.name}] ${vp.width}x${vp.height} (page: ${currentUrl})`);
    console.log(`   -> Horizontal: ${statusBadge} | Touch targets <36px: ${metrics.tinyTapCount}`);
    console.log(`   -> Sidebar presence on scroll: ${sidebarStatus}`);
    if (metrics.tinyTapExamples.length > 0) {
      console.log(`   Sample small targets:`, metrics.tinyTapExamples.map(e => `<${e.tag}> "${e.text}" (${e.width}x${e.height}px)`).join(', '));
    }
    console.log(`   Screenshot: screenshots/${vp.name}.png\n`);

    await context.close();
  }

  await browser.close();
  await prisma.$disconnect();
  console.log(`🏁 Responsiveness & sidebar audit complete.`);
})();
