import { expect, test, type Page } from "@playwright/test";

const ENDPOINT = "https://formspree.io/f/xeaeylry";

type MockOptions = {
  status?: number;
  delay?: number;
  onRequest?: (postData: string | null) => void;
};

async function mockFormspree(page: Page, options: MockOptions = {}) {
  let requests = 0;

  await page.route(ENDPOINT, async (route) => {
    if (route.request().method() !== "POST") {
      await route.fulfill({
        status: 204,
        headers: { "access-control-allow-origin": "*" },
      });
      return;
    }

    requests += 1;
    options.onRequest?.(route.request().postData());
    if (options.delay) await new Promise((resolve) => setTimeout(resolve, options.delay));

    const status = options.status ?? 200;
    await route.fulfill({
      status,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(
        status >= 400
          ? { ok: false, errors: [{ message: "Mocked Formspree failure" }] }
          : { ok: true },
      ),
    });
  });

  return { requestCount: () => requests };
}

async function fillRequired(page: Page, overrides: Partial<Record<string, string>> = {}) {
  const values = {
    "#contact-name": "Test Person",
    "#contact-email": "test@example.com",
    "#contact-message": "This is an automated test message for the contact form.",
    ...overrides,
  };

  await page.locator("#contact-enquiry").selectOption("general");
  await page.locator("#contact-consent").check();

  for (const [selector, value] of Object.entries(values)) {
    await page.locator(selector).fill(value);
  }
}

test("required fields, consent and the email format are validated before sending", async ({
  page,
}) => {
  const { requestCount } = await mockFormspree(page);
  await page.goto("/kontakt");

  await page.getByRole("button", { name: "Nachricht senden" }).click();
  await expect(page.locator("#contact-name-error")).toBeVisible();
  await expect(page.locator("#contact-email-error")).toBeVisible();
  await expect(page.locator("#contact-enquiry-error")).toBeVisible();
  await expect(page.locator("#contact-message-error")).toBeVisible();
  await expect(page.locator("#contact-consent-error")).toBeVisible();
  await expect(page.locator("#contact-name")).toBeFocused();
  expect(requestCount()).toBe(0);

  await fillRequired(page, { "#contact-email": "not-an-email" });
  await page.getByRole("button", { name: "Nachricht senden" }).click();
  await expect(page.locator("#contact-email-error")).toBeVisible();
  await expect(page.locator("#contact-email")).toBeFocused();
  expect(requestCount()).toBe(0);
});

test("conditional fields follow the selected enquiry type", async ({ page }) => {
  await page.goto("/kontakt");

  await page.locator("#contact-enquiry").selectOption("supplier");
  await expect(page.locator("#contact-supplierOffer")).toBeVisible();
  await expect(page.locator("#contact-productInterest")).toHaveCount(0);

  await page.locator("#contact-enquiry").selectOption("availability");
  await expect(page.locator("#contact-productInterest")).toBeVisible();
  await expect(page.locator("#contact-supplierOffer")).toHaveCount(0);

  await page.locator("#contact-enquiry").selectOption("logistics");
  await expect(page.locator("#contact-deliveryArea")).toBeVisible();

  await page.locator("#contact-enquiry").selectOption("general");
  await expect(page.locator("#contact-deliveryArea")).toHaveCount(0);
});

test("a valid form is posted to Formspree and only then shows success", async ({ page }) => {
  let body = "";
  const { requestCount } = await mockFormspree(page, {
    onRequest: (postData) => {
      body = postData ?? "";
    },
  });

  await page.goto("/kontakt");
  await page.locator("#contact-company").fill("Test AG");
  await page.locator("#contact-phone").fill("+41 44 000 00 00");
  await fillRequired(page);

  await page.getByRole("button", { name: "Nachricht senden" }).click();

  await expect(page.getByRole("status")).toContainText("Vielen Dank für Ihre Nachricht");
  expect(requestCount()).toBe(1);
  for (const value of [
    "Test Person",
    "Test AG",
    "+41 44 000 00 00",
    "test@example.com",
    "enquiry_label",
    "Allgemeine Anfrage",
    "This is an automated test message",
    "privacy_consent",
  ]) {
    expect(body).toContain(value);
  }
  expect(body).toContain("_gotcha");
  await expect(page.locator("#contact-name")).toHaveValue("");
  await expect(page.locator("#contact-consent")).not.toBeChecked();
});

test("the submit button shows a loading state and blocks duplicate sends", async ({ page }) => {
  // Hold the response open so the in-flight state is observable without racing.
  let requests = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  await page.route(ENDPOINT, async (route) => {
    requests += 1;
    await gate;
    await route.fulfill({
      status: 200,
      headers: { "access-control-allow-origin": "*", "content-type": "application/json" },
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/kontakt");
  await fillRequired(page);

  await page.getByRole("button", { name: "Nachricht senden" }).click();

  // Fire two more submits while the first request is still in flight.
  await page.evaluate(() => {
    const form = document.querySelector("form");
    form?.requestSubmit();
    form?.requestSubmit();
  });

  await expect(page.getByRole("button", { name: "Wird gesendet …" })).toBeDisabled();
  await expect.poll(() => requests).toBe(1);

  release();
  await expect(page.getByRole("status")).toContainText("Vielen Dank für Ihre Nachricht");
  expect(requests).toBe(1);
});

test("a failed Formspree response shows an error and keeps the entered data", async ({ page }) => {
  await mockFormspree(page, { status: 500 });
  await page.goto("/kontakt");
  await fillRequired(page);

  await page.getByRole("button", { name: "Nachricht senden" }).click();

  await expect(page.getByRole("alert")).toContainText("Die Nachricht konnte nicht gesendet werden");
  await expect(page.locator("#contact-name")).toHaveValue("Test Person");
  await expect(page.getByText("Vielen Dank für Ihre Nachricht")).toHaveCount(0);
});

test("network failure is reported instead of a false success", async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.abort());
  await page.goto("/kontakt");
  await fillRequired(page);

  await page.getByRole("button", { name: "Nachricht senden" }).click();
  await expect(page.getByRole("alert")).toContainText("Die Nachricht konnte nicht gesendet werden");
  await expect(page.getByText("Vielen Dank für Ihre Nachricht")).toHaveCount(0);
});
