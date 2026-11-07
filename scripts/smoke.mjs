/**
 * Smoke test against the production build (vite preview on :4173).
 * Checks every route at desktop and mobile widths, fails on console/page errors
 * and HTTP 4xx/5xx, exercises language switching and the contact form, and
 * writes screenshots to ./preview.
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const routes = [
  "/",
  "/produkte",
  "/dienstleistungen",
  "/ueber-uns",
  "/daehler-story",
  "/kontakt",
  "/datenschutz",
  "/does-not-exist",
];

await mkdir("preview", { recursive: true });

const problems = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on("console", (message) => {
  if (message.type() === "error") problems.push(`console: ${message.text()}`);
});
page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
page.on("response", (response) => {
  const status = response.status();
  const url = response.url();
  const thirdParty = /google|gstatic|googleapis/.test(url);
  if (status >= 400 && !thirdParty && !url.includes("/api/contact")) {
    problems.push(`http ${status}: ${url}`);
  }
});

for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  for (const route of routes) {
    const response = await page.goto(BASE + route, { waitUntil: "load" });
    // Let the entrance animations finish before asserting visibility or capturing.
    await page.waitForTimeout(1600);
    const name = route === "/" ? "home" : route.replace(/\W+/g, "") || "home";
    const h1 = await page.locator("h1").first().textContent().catch(() => null);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    if (overflow) problems.push(`horizontal overflow at ${width}px on ${route}`);
    const heroVisible = await page.locator("h1").first().isVisible();
    if (!heroVisible) problems.push(`h1 not visible at ${width}px on ${route}`);
    console.log(
      `${width}px ${route.padEnd(18)} ${response?.status()} h1="${(h1 ?? "—").trim().slice(0, 48)}"`,
    );
    if (width === 390 || route === "/" || route === "/produkte") {
      await page.screenshot({
        path: `preview/${width === 390 ? "mobile" : "desktop"}-${name}.png`,
        fullPage: false,
      });
    }
  }
}

// ------------------------------------------------------------ first-visit language
await page.goto(`${BASE}/`, { waitUntil: "load" });
const firstVisitLang = await page.evaluate(() => document.documentElement.lang);
console.log(`first visit html lang: ${firstVisitLang}`);
if (firstVisitLang !== "de-CH") problems.push(`first visit should be German, got ${firstVisitLang}`);

// ---------------------------------------------------------------- language switch
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${BASE}/produkte`, { waitUntil: "load" });
const firstHeadingDe = (await page.locator("h1").first().textContent())?.trim();

for (const [label, expectedLang] of [
  ["Français", "fr-CH"],
  ["Italiano", "it-CH"],
  ["Português", "pt-BR"],
  ["English", "en"],
  ["Deutsch", "de-CH"],
]) {
  await page.locator('button[aria-haspopup="listbox"]').first().click();
  await page.getByRole("option", { name: label, exact: false }).click();
  await page.waitForTimeout(250);
  const lang = await page.evaluate(() => document.documentElement.lang);
  const heading = (await page.locator("h1").first().textContent())?.trim();
  const stored = await page.evaluate(() => localStorage.getItem("daehler-language"));
  console.log(`lang ${label.padEnd(10)} html=${lang} stored=${stored} h1="${heading?.slice(0, 40)}"`);
  if (lang !== expectedLang) problems.push(`html lang ${lang} !== ${expectedLang} for ${label}`);
}

// persistence across a reload
await page.reload({ waitUntil: "load" });
const persisted = await page.evaluate(() => document.documentElement.lang);
if (persisted !== "de-CH") problems.push(`language not persisted after reload (${persisted})`);
else console.log("language persisted after reload");

// ------------------------------------------------------------------ contact form
await page.goto(`${BASE}/kontakt`, { waitUntil: "load" });
await page.getByLabel(/E-Mail-Adresse|E-Mail/).first().fill("not-an-email");
await page.getByLabel(/Vollständiger Name|Name/).first().fill("Test Person");
await page.getByLabel(/Betreff/).first().fill("Test request");
await page.getByLabel(/Nachricht/).first().fill("This is a validation smoke test message.");
await page.getByRole("button", { name: /Nachricht senden/ }).click();
await page.waitForTimeout(400);
const emailError = await page.locator("#contact-email-error").textContent().catch(() => null);
console.log(`validation error shown: ${emailError ? "yes" : "NO"}`);
if (!emailError) problems.push("email validation error was not shown");

// mobile menu
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "load" });
await page.getByRole("button", { name: /Menü öffnen/ }).click();
await page.waitForTimeout(450);
const menuVisible = await page.locator("#mobile-menu").isVisible();
const scrollLocked = await page.evaluate(() => getComputedStyle(document.body).overflow === "hidden");
console.log(`mobile menu visible=${menuVisible} scrollLocked=${scrollLocked}`);
if (!menuVisible) problems.push("mobile menu did not open");
if (!scrollLocked) problems.push("body scroll was not locked with the mobile menu open");
await page.screenshot({ path: "preview/mobile-menu.png" });

await browser.close();

if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const problem of [...new Set(problems)]) console.log(" -", problem);
  process.exit(1);
}

console.log("\nSMOKE: OK — all routes, languages and interactions clean");
