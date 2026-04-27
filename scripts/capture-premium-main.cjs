const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const heading = page.locator("h2", { hasText: "최근 완료된" }).first();
  const box = await heading.boundingBox();

  if (!box) {
    throw new Error("Could not find target section heading: 최근 완료된");
  }

  const targetY = Math.max(0, Math.floor(box.y - 220));
  await page.evaluate((y) => window.scrollTo(0, y), targetY);
  await page.waitForTimeout(800);

  await page.screenshot({
    path: "portfolio-shots/01-main-1200x1200-premium-space.png",
  });

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
