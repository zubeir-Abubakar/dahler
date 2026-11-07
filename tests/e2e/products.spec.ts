import { expect, test } from "@playwright/test";

const resultCount = async (page: import("@playwright/test").Page) => {
  const text = (await page.locator('p[aria-live="polite"]').first().textContent()) ?? "";
  return Number(text.match(/\d+/)?.[0] ?? "0");
};

test("search narrows the catalogue and clearing restores it", async ({ page }) => {
  await page.goto("/produkte");

  const cards = page.locator('main a[href="/produkte"]');
  const total = await resultCount(page);
  expect(total).toBeGreaterThan(0);
  await expect(cards).toHaveCount(total);

  const search = page.locator("#product-search");
  await search.fill("mango");

  const matches = await resultCount(page);
  expect(matches).toBeGreaterThan(0);
  expect(matches).toBeLessThan(total);
  await expect(cards).toHaveCount(matches);
  await expect(page.getByRole("heading", { name: /mango/i }).first()).toBeVisible();

  await page.getByRole("button", { name: "Suche löschen" }).click();
  await expect(search).toHaveValue("");
  await expect.poll(() => resultCount(page)).toBe(total);
});

test("category filters and the empty state work", async ({ page }) => {
  await page.goto("/produkte");
  const total = await resultCount(page);

  const vegetables = page.getByRole("button", { name: "Gemüse und Blätter" });
  await vegetables.click();
  await expect(vegetables).toHaveAttribute("aria-pressed", "true");

  const vegetablesCount = await resultCount(page);
  expect(vegetablesCount).toBeGreaterThan(0);
  expect(vegetablesCount).toBeLessThan(total);
  await expect(page.locator('main a[href="/produkte"] p')).toHaveCount(vegetablesCount);
  for (const label of await page.locator('main a[href="/produkte"] p').allTextContents()) {
    expect(label.trim()).toBe("Gemüse und Blätter");
  }

  await page.locator("#product-search").fill("zzzz-gibt-es-nicht");
  await expect(page.getByRole("heading", { name: "Keine Produkte gefunden." })).toBeVisible();

  await page.getByRole("button", { name: "Filter zurücksetzen" }).click();
  await expect.poll(() => resultCount(page)).toBe(total);
  await expect(page.locator("#product-search")).toHaveValue("");
});
