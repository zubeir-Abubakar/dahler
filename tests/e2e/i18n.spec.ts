import { expect, test } from "@playwright/test";

const languages = [
  {
    label: "Français",
    code: "fr",
    lang: "fr-CH",
    heading: "Des exotiques frais, chaque jour dans toute la Suisse.",
  },
  {
    label: "Italiano",
    code: "it",
    lang: "it-CH",
    heading: "Esotici freschi, ogni giorno in tutta la Svizzera.",
  },
  {
    label: "Português",
    code: "pt",
    lang: "pt-BR",
    heading: "Frutas exóticas frescas, todos os dias em toda a Suíça.",
  },
  {
    label: "English",
    code: "en",
    lang: "en",
    heading: "Fresh exotics, every day across Switzerland.",
  },
  {
    label: "Deutsch",
    code: "de",
    lang: "de-CH",
    heading: "Frische Exoten, jeden Tag in der ganzen Schweiz.",
  },
];

test("first visit is German and the switcher reaches all five languages", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "de-CH");

  for (const language of languages) {
    await page.locator('header button[aria-haspopup="listbox"]').click();
    await page.getByRole("option", { name: new RegExp(language.label) }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", language.lang);
    await expect(page.locator("h1")).toHaveText(language.heading);
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("daehler-language")))
      .toBe(language.code);
  }
});

test("the selected language survives a reload", async ({ page }) => {
  await page.goto("/produkte");
  await page.locator('header button[aria-haspopup="listbox"]').click();
  await page.getByRole("option", { name: /English/ }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText("Our products");
  await expect(page).toHaveTitle("Products – Dähler Früchte");
});

test("the language dropdown is usable from the keyboard", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator('header button[aria-haspopup="listbox"]');

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("option", { name: /Deutsch/ })).toBeFocused();

  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: /Français/ })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
