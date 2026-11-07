import { expect, test } from "@playwright/test";

test("gallery lightbox opens, navigates with the keyboard and returns focus", async ({ page }) => {
  await page.goto("/daehler-story");

  const gallery = page.locator("#galerie");
  await gallery.scrollIntoViewIfNeeded();

  const firstImage = gallery.locator('button[aria-label^="Bild vergrössern"]').first();
  await firstImage.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("1 von 8");

  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("2 von 8");

  await page.keyboard.press("ArrowLeft");
  await expect(dialog).toContainText("1 von 8");

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(firstImage).toBeFocused();
});

test("lightbox close button works and body scrolling is restored", async ({ page }) => {
  await page.goto("/daehler-story");
  const gallery = page.locator("#galerie");
  await gallery.scrollIntoViewIfNeeded();
  await gallery.locator('button[aria-label^="Bild vergrössern"]').first().click();

  await expect(page.evaluate(() => getComputedStyle(document.body).overflow)).resolves.toBe(
    "hidden",
  );
  await page.getByRole("button", { name: "Galerie schliessen" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});
