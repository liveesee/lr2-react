const { test, expect } = require("@playwright/test");

const MALICIOUS = `Отличная статья <b>спасибо</b>! <img src=x onerror="alert('XSS PoC')"><script>alert('XSS PoC')</script>`;

test("страница отдаётся с заголовками Helmet и CSP", async ({ page }) => {
  const response = await page.goto("/posts/olive-ink");
  const headers = response.headers();
  const csp = headers["content-security-policy"];

  expect(csp).toContain("default-src 'self'");
  expect(csp).toMatch(/script-src 'self'(;|$)/);
  expect(csp).toContain("script-src-attr 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["strict-transport-security"]).toMatch(/max-age=\d+/);
  expect(headers["referrer-policy"]).toBe("no-referrer");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("вредоносный HTML в комментарии не выполняется", async ({ page }) => {
  const dialogs = [];
  page.on("dialog", async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.dismiss();
  });
  await page.route(
    (url) => url.pathname === "/api/comments",
    (route) =>
      route.fulfill({
        status: 200,
        json: [{ _id: "xss", author: "Вы", text: MALICIOUS, createdAt: new Date().toISOString() }],
      }),
  );

  await page.goto("/posts/olive-ink");
  const comment = page.getByRole("list", { name: "Комментарии" }).getByRole("listitem");
  await expect(comment.locator("b")).toHaveText("спасибо");
  await expect(comment.locator("img, script")).toHaveCount(0);
  await page.waitForTimeout(300);
  expect(dialogs).toEqual([]);
});

test("CSP блокирует встроенный обработчик, даже если очистку обойти", async ({ page }) => {
  const violations = [];
  page.on("console", (message) => {
    if (message.text().includes("Content Security Policy")) violations.push(message.text());
  });
  await page.goto("/posts/olive-ink");

  await page.evaluate(() => {
    document.body.insertAdjacentHTML("beforeend", `<img src="/missing.png" onerror="window.__xss = true">`);
  });
  await page.waitForTimeout(500);

  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  expect(violations.join("\n")).toContain("script-src-attr 'none'");
});
