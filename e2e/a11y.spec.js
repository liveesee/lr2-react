const { test, expect } = require("@playwright/test");
const { default: AxeBuilder } = require("@axe-core/playwright");

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

test.beforeEach(async ({ page }) => {
  const comments = [];
  await page.route(
    (url) => url.pathname === "/api/comments",
    async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        const body = request.postDataJSON();
        const comment = { _id: `c${comments.length + 1}`, ...body, createdAt: new Date().toISOString() };
        comments.push(comment);
        await route.fulfill({ status: 201, json: comment });
        return;
      }
      await route.fulfill({ status: 200, json: comments });
    },
  );
});

async function expectNoViolations(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
}

test("axe: главная страница и открытая форма комментариев", async ({ page }) => {
  await page.goto("/");
  await expectNoViolations(page);

  await page.getByRole("button", { name: "Комментарий" }).first().click();
  await expect(page.getByLabel("Текст комментария")).toBeVisible();
  await expectNoViolations(page);
});

test("axe: страница статьи и состояние ошибки", async ({ page }) => {
  await page.goto("/posts/olive-ink");
  await expectNoViolations(page);

  await page.getByRole("button", { name: "Отправить" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "добавьте пару слов" })).toBeVisible();
  await expectNoViolations(page);
});

test("Статья: сценарий только с клавиатуры", async ({ page }) => {
  await page.goto("/posts/olive-ink");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Перейти к содержимому" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Все статьи" })).toBeFocused();

  await page.keyboard.press("Tab");
  const like = page.getByRole("button", { name: "Нравится: 0" });
  await expect(like).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Нравится: 1" })).toBeFocused();

  await page.keyboard.press("Tab");
  const input = page.getByLabel("Текст комментария");
  await expect(input).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Отправить" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute("aria-invalid", "true");

  await page.keyboard.type("Прочитал, используя только клавиатуру");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("list", { name: "Комментарии" })).toContainText("Прочитал, используя только клавиатуру");
  await expect(page.getByRole("status")).toHaveText("Комментарий опубликован");
});

test("Главная: комментарии в карточке открываются с клавиатуры", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("article", { name: "Тихая архитектура утренних страниц" });
  const toggle = card.getByRole("button", { name: "Комментарий" });

  await toggle.focus();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Tab");
  await expect(card.getByRole("button", { name: "Поделиться" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(card.getByLabel("Текст комментария")).toBeFocused();

  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(card.getByLabel("Текст комментария")).toHaveCount(0);
});
